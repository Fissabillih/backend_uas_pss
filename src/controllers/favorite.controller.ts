import { Response, NextFunction } from 'express';
import { FavoriteService } from '../services/favorite.service';
import { FavoriteRepository } from '../repositories/favorite.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ResponseHelper } from '../utils/response';
import { AuthenticatedRequest } from '../types';

const favoriteService = new FavoriteService(new FavoriteRepository(), new ProductRepository());

export class FavoriteController {
  async getMyFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query as { page?: string; limit?: string };
      const result = await favoriteService.getUserFavorites(req.user!.userId, {
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
      });
      ResponseHelper.paginate(res, 'Favorites retrieved successfully', result.favorites, result.total, result.page, result.limit);
    } catch (err) { next(err); }
  }

  async toggleFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await favoriteService.toggleFavorite(req.user!.userId, req.params.productId);
      ResponseHelper.success(res, result.message, { isFavorited: result.isFavorited });
    } catch (err) { next(err); }
  }

  async checkFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const isFavorited = await favoriteService.isFavorited(req.user!.userId, req.params.productId);
      ResponseHelper.success(res, 'Favorite status retrieved', { isFavorited });
    } catch (err) { next(err); }
  }
}
