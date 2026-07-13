import { FavoriteRepository } from '../repositories/favorite.repository';
import { ProductRepository } from '../repositories/product.repository';
import { AppError } from '../middlewares/error.middleware';

export class FavoriteService {
  constructor(
    private readonly favoriteRepo: FavoriteRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async getUserFavorites(userId: string, options: { page?: number; limit?: number } = {}) {
    const { favorites, total, page, limit } = await this.favoriteRepo.findByUser(userId, options);
    const items = favorites.map((f) => ({
      id: f.id,
      product: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(f as any).product,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        price: parseFloat((f as any).product.price.toString()),
        isFavorited: true,
      },
      createdAt: f.createdAt,
    }));
    return { favorites: items, total, page, limit };
  }

  async toggleFavorite(userId: string, productId: string): Promise<{ isFavorited: boolean; message: string }> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new AppError('Product not found', 404);

    const existing = await this.favoriteRepo.findByUserAndProduct(userId, productId);
    if (existing) {
      await this.favoriteRepo.delete(userId, productId);
      return { isFavorited: false, message: 'Product removed from favorites' };
    }

    await this.favoriteRepo.create(userId, productId);
    return { isFavorited: true, message: 'Product added to favorites' };
  }

  async isFavorited(userId: string, productId: string): Promise<boolean> {
    const fav = await this.favoriteRepo.findByUserAndProduct(userId, productId);
    return !!fav;
  }
}
