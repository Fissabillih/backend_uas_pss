import { Prisma, Product, ProductStatus } from '@prisma/client';
import prisma from '../config/database';
import { parsePagination } from '../utils/pagination';
import { ProductQueryParams, SortOrder } from '../types';

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
};

function buildProductWhere(filters: ProductQueryParams): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { deletedAt: null };
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.status) where.status = filters.status as ProductStatus;
  if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
  if (filters.keyword) {
    where.OR = [
      { name: { contains: filters.keyword } },
      { description: { contains: filters.keyword } },
    ];
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }
  return where;
}

function buildOrderBy(sort?: SortOrder): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'oldest': return [{ createdAt: 'asc' }];
    case 'price_asc': return [{ price: 'asc' }];
    case 'price_desc': return [{ price: 'desc' }];
    case 'alphabetical': return [{ name: 'asc' }];
    default: return [{ createdAt: 'desc' }];
  }
}

export class ProductRepository {
  async findAll(params: ProductQueryParams) {
    const { page, limit, skip } = parsePagination(params);
    const where = buildProductWhere(params);
    const orderBy = buildOrderBy(params.sort);

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: limit, orderBy, include: productInclude }),
      prisma.product.count({ where }),
    ]);
    return { products, total, page, limit };
  }

  async findById(id: string): Promise<(Product & { category: { id: string; name: string; slug: string } }) | null> {
    return prisma.product.findFirst({ where: { id, deletedAt: null }, include: productInclude }) as Promise<(Product & { category: { id: string; name: string; slug: string } }) | null>;
  }

  async findBySlug(slug: string): Promise<(Product & { category: { id: string; name: string; slug: string } }) | null> {
    return prisma.product.findFirst({ where: { slug, deletedAt: null }, include: productInclude }) as Promise<(Product & { category: { id: string; name: string; slug: string } }) | null>;
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product & { category: { id: string; name: string; slug: string } }> {
    return prisma.product.create({ data, include: productInclude }) as Promise<Product & { category: { id: string; name: string; slug: string } }>;
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product & { category: { id: string; name: string; slug: string } }> {
    return prisma.product.update({ where: { id }, data, include: productInclude }) as Promise<Product & { category: { id: string; name: string; slug: string } }>;
  }

  async softDelete(id: string): Promise<Product> {
    return prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async incrementViewCount(id: string): Promise<void> {
    await prisma.product.update({ where: { id }, data: { viewCount: { increment: 1 } } });
  }

  async getFeatured(limit = 8) {
    return prisma.product.findMany({
      where: { isFeatured: true, status: 'ACTIVE', deletedAt: null },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: productInclude,
    });
  }

  async getNewest(limit = 8) {
    return prisma.product.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: productInclude,
    });
  }

  async countAll(): Promise<number> {
    return prisma.product.count({ where: { deletedAt: null } });
  }

  async countByStatus(status: ProductStatus): Promise<number> {
    return prisma.product.count({ where: { status, deletedAt: null } });
  }

  async getAllSlugs(): Promise<string[]> {
    const prods = await prisma.product.findMany({ select: { slug: true }, where: { deletedAt: null } });
    return prods.map((p) => p.slug);
  }

  async getLowStock(threshold = 10, limit = 10) {
    return prisma.product.findMany({
      where: { stock: { lte: threshold }, deletedAt: null },
      take: limit,
      orderBy: { stock: 'asc' },
      include: productInclude,
    });
  }
}
