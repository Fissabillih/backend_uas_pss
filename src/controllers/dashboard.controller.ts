import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { UserRepository } from '../repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { BannerRepository } from '../repositories/banner.repository';
import { ResponseHelper } from '../utils/response';
import { env } from '../config/env';

const dashboardService = new DashboardService(
  new UserRepository(),
  new ProductRepository(),
  new CategoryRepository(),
  new BannerRepository(),
);

export class DashboardController {
  async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await dashboardService.getStatistics();
      ResponseHelper.success(res, 'Dashboard statistics retrieved successfully', stats);
    } catch (err) { next(err); }
  }

  getVersion(req: Request, res: Response): void {
    ResponseHelper.success(res, 'Version information', {
      version: '1.0.0',
      name: env.APP_NAME,
      environment: env.NODE_ENV,
      apiVersion: env.API_VERSION,
      nodeVersion: process.version,
    });
  }
}
