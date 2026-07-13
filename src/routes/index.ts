import { Router, Request, Response } from 'express';
import { env } from '../config/env';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import bannerRoutes from './banner.routes';
import storeProfileRoutes from './storeProfile.routes';
import userRoutes from './user.routes';
import favoriteRoutes from './favorite.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// ── System Routes (no auth, no version prefix) ─────────────
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: `Welcome to ${env.APP_NAME}`,
    data: {
      name: env.APP_NAME,
      version: '1.0.0',
      apiVersion: env.API_VERSION,
      environment: env.NODE_ENV,
      documentation: `${env.APP_URL}/api-docs`,
    },
  });
});

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    },
  });
});

router.get('/version', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Version information',
    data: {
      version: '1.0.0',
      name: env.APP_NAME,
      environment: env.NODE_ENV,
      apiVersion: env.API_VERSION,
      nodeVersion: process.version,
    },
  });
});

// ── API Routes ─────────────────────────────────────────────
const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/banners', bannerRoutes);
apiRouter.use('/store', storeProfileRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/favorites', favoriteRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

router.use(`/api/${env.API_VERSION}`, apiRouter);

export default router;
