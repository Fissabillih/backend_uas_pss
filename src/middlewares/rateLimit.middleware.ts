import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { ResponseHelper } from '../utils/response';
import { Request, Response } from 'express';

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    ResponseHelper.error(
      res,
      'Too many requests, please try again later',
      undefined,
      429,
    );
  },
  skip: (req: Request) => req.path === '/health' || req.path === '/',
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    ResponseHelper.error(
      res,
      'Too many authentication attempts, please try again after 15 minutes',
      undefined,
      429,
    );
  },
});
