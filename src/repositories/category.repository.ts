import { Prisma, Category } from '@prisma/client';
import prisma from '../config/database';
import { parsePagination } from '../utils/pagination';

export class CategoryRepository {
  async findAll(options: { isActive?: boolean; page?: number; limit?: number; keyword?: string } = {}) {
    const { page, limit, skip } = parsePagination(options);
    const where: Prisma.CategoryWhereInput = {
      deletedAt: null,
      ...(options.isActive !== undefined && { isActive: options.isActive }),
      ...(options.keyword && { name: { contains: options.keyword } }),
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        include: { _count: { select: { products: { where: { deletedAt: null, status: 'ACTIVE' } } } } },
      }),
      prisma.category.count({ where }),
    ]);
    return { categories, total, page, limit };
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findFirst({ where: { id, deletedAt: null } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findFirst({ where: { slug, deletedAt: null } });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findFirst({ where: { name: { equals: name }, deletedAt: null } });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Category> {
    return prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async countAll(): Promise<number> {
    return prisma.category.count({ where: { deletedAt: null } });
  }

  async getAllSlugs(): Promise<string[]> {
    const cats = await prisma.category.findMany({ select: { slug: true }, where: { deletedAt: null } });
    return cats.map((c) => c.slug);
  }
}
