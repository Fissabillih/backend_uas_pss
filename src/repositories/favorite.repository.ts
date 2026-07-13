import { Favorite } from '@prisma/client';
import prisma from '../config/database';
import { parsePagination } from '../utils/pagination';

export class FavoriteRepository {
  async findByUserAndProduct(userId: string, productId: string): Promise<Favorite | null> {
    return prisma.favorite.findUnique({ where: { userId_productId: { userId, productId } } });
  }

  async create(userId: string, productId: string): Promise<Favorite> {
    return prisma.favorite.create({ data: { userId, productId } });
  }

  async delete(userId: string, productId: string): Promise<void> {
    await prisma.favorite.delete({ where: { userId_productId: { userId, productId } } });
  }

  async findByUser(userId: string, options: { page?: number; limit?: number } = {}) {
    const { page, limit, skip } = parsePagination(options);
    const where = { userId };
    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            include: { category: { select: { id: true, name: true, slug: true } } },
          },
        },
      }),
      prisma.favorite.count({ where }),
    ]);
    return { favorites, total, page, limit };
  }

  async getFavoriteProductIds(userId: string): Promise<string[]> {
    const favs = await prisma.favorite.findMany({ where: { userId }, select: { productId: true } });
    return favs.map((f) => f.productId);
  }

  async countByUser(userId: string): Promise<number> {
    return prisma.favorite.count({ where: { userId } });
  }
}
