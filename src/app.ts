import './config/env'; // validate env first
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import './config/passport'; // initialize Google OAuth strategy

import { env } from './config/env';
import { logger } from './config/logger';
import morganMiddleware from './middlewares/morgan.middleware';
import { globalRateLimiter } from './middlewares/rateLimit.middleware';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { swaggerSpec } from './config/swagger';
import routes from './routes/index';

const app = express();

// ── Security Middleware ───────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

// ── General Middleware ────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morganMiddleware);
app.use(globalRateLimiter);
app.use(passport.initialize());

// ── Static Files (uploads) ────────────────────────────────
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'src', 'uploads'), {
    maxAge: '1d',
    etag: true,
  }),
);

// ── Swagger Documentation ─────────────────────────────────
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TB Mulya Abadi API Docs',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }),
);

app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── Application Routes ────────────────────────────────────
app.use(routes);

// ── 404 Handler ───────────────────────────────────────────
app.use(notFoundHandler);

// ── Global Error Handler ──────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────
if (require.main === module) {
  app.listen(env.PORT, () => {
    logger.info(`🚀 ${env.APP_NAME} is running`);
    logger.info(`📍 Server: ${env.APP_URL}`);
    logger.info(`📚 API Docs: ${env.APP_URL}/api-docs`);
    logger.info(`🌱 Environment: ${env.NODE_ENV}`);
  });
}

export default app;
