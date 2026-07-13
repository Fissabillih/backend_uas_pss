import { Prisma, Banner } from '@prisma/client';
import prisma from '../config/database';
import { parsePagination } from '../utils/pagination';

export class BannerRepository {
  async findAll(options: { page?: number; limit?: number; isActive?: boolean } = {}) {
    const { page, limit, skip } = parsePagination(options);
    const where: Prisma.BannerWhereInput = {
      deletedAt: null,
      ...(options.isActive !== undefined && { isActive: options.isActive }),
    };
    const [banners, total] = await Promise.all([
      prisma.banner.findMany({ where, skip, take: limit, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
      prisma.banner.count({ where }),
    ]);
    return { banners, total, page, limit };
  }

  async findActive() {
    const now = new Date();
    return prisma.banner.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
        ],
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: string): Promise<Banner | null> {
    return prisma.banner.findFirst({ where: { id, deletedAt: null } });
  }

  async create(data: Prisma.BannerCreateInput): Promise<Banner> {
    return prisma.banner.create({ data });
  }

  async update(id: string, data: Prisma.BannerUpdateInput): Promise<Banner> {
    return prisma.banner.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Banner> {
    return prisma.banner.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async countAll(): Promise<number> {
    return prisma.banner.count({ where: { deletedAt: null } });
  }
}
