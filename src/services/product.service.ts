import { Decimal } from '@prisma/client/runtime/library';
import { ProductRepository } from '../repositories/product.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { FavoriteRepository } from '../repositories/favorite.repository';
import { AppError } from '../middlewares/error.middleware';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../dto/product.dto';
import { generateSlug, generateUniqueSlug } from '../utils/slug';
import { ProductQueryParams } from '../types';

function decimalToNumber(d: Decimal | null | undefined): number | null {
  if (d == null) return null;
  return parseFloat(d.toString());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProductToDto(p: any, isFavorited?: boolean): ProductResponseDto {
  return {
    id: p.id, name: p.name, slug: p.slug, description: p.description,
    price: parseFloat(p.price.toString()),
    stock: p.stock,
    weight: decimalToNumber(p.weight),
    imageUrl: p.imageUrl, status: p.status, isFeatured: p.isFeatured,
    viewCount: p.viewCount, categoryId: p.categoryId, category: p.category,
    isFavorited: isFavorited ?? false, createdAt: p.createdAt, updatedAt: p.updatedAt,
  };
}

export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly favoriteRepo: FavoriteRepository,
  ) {}

  async getAll(params: ProductQueryParams, userId?: string) {
    const { products, total, page, limit } = await this.productRepo.findAll(params);
    let favoriteIds: string[] = [];
    if (userId) favoriteIds = await this.favoriteRepo.getFavoriteProductIds(userId);

    return {
      products: products.map((p) => mapProductToDto(p, favoriteIds.includes(p.id))),
      total, page, limit,
    };
  }

  async getById(id: string, userId?: string): Promise<ProductResponseDto> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new AppError('Product not found', 404);

    await this.productRepo.incrementViewCount(id);

    let isFavorited = false;
    if (userId) {
      const fav = await this.favoriteRepo.findByUserAndProduct(userId, id);
      isFavorited = !!fav;
    }
    return mapProductToDto(product, isFavorited);
  }

  async getBySlug(slug: string, userId?: string): Promise<ProductResponseDto> {
    const product = await this.productRepo.findBySlug(slug);
    if (!product) throw new AppError('Product not found', 404);

    await this.productRepo.incrementViewCount(product.id);

    let isFavorited = false;
    if (userId) {
      const fav = await this.favoriteRepo.findByUserAndProduct(userId, product.id);
      isFavorited = !!fav;
    }
    return mapProductToDto(product, isFavorited);
  }

  async getFeatured(limit = 8): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.getFeatured(limit);
    return products.map((p) => mapProductToDto(p));
  }

  async getNewest(limit = 8): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.getNewest(limit);
    return products.map((p) => mapProductToDto(p));
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const category = await this.categoryRepo.findById(dto.categoryId);
    if (!category) throw new AppError('Category not found', 404);

    let slug = dto.slug ?? generateSlug(dto.name);
    const existing = await this.productRepo.findBySlug(slug);
    if (existing) {
      const allSlugs = await this.productRepo.getAllSlugs();
      slug = generateUniqueSlug(dto.name, allSlugs);
    }

    const product = await this.productRepo.create({
      name: dto.name, slug, description: dto.description,
      price: dto.price, stock: dto.stock, weight: dto.weight,
      imageUrl: dto.imageUrl, status: dto.status ?? 'ACTIVE',
      isFeatured: dto.isFeatured ?? false,
      category: { connect: { id: dto.categoryId } },
    });
    return mapProductToDto(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const existing = await this.productRepo.findById(id);
    if (!existing) throw new AppError('Product not found', 404);

    if (dto.categoryId) {
      const category = await this.categoryRepo.findById(dto.categoryId);
      if (!category) throw new AppError('Category not found', 404);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const slugConflict = await this.productRepo.findBySlug(dto.slug);
      if (slugConflict && slugConflict.id !== id) throw new AppError('Slug already in use', 409);
    }

    const product = await this.productRepo.update(id, {
      name: dto.name,
      slug: dto.slug ?? (dto.name ? generateSlug(dto.name) : existing.slug),
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      weight: dto.weight,
      imageUrl: dto.imageUrl,
      status: dto.status,
      isFeatured: dto.isFeatured,
      ...(dto.categoryId && { category: { connect: { id: dto.categoryId } } }),
    });
    return mapProductToDto(product);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.productRepo.findById(id);
    if (!existing) throw new AppError('Product not found', 404);
    await this.productRepo.softDelete(id);
  }

  async updateImage(id: string, imageUrl: string): Promise<ProductResponseDto> {
    const existing = await this.productRepo.findById(id);
    if (!existing) throw new AppError('Product not found', 404);
    const product = await this.productRepo.update(id, { imageUrl });
    return mapProductToDto(product);
  }
}
