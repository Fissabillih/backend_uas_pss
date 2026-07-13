import { CategoryRepository } from '../repositories/category.repository';
import { AppError } from '../middlewares/error.middleware';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../dto/category.dto';
import { generateSlug, generateUniqueSlug } from '../utils/slug';
import { Category } from '@prisma/client';

type CategoryWithCount = Category & { _count?: { products: number } };

function mapCategoryToDto(cat: CategoryWithCount): CategoryResponseDto {
  return {
    id: cat.id, name: cat.name, slug: cat.slug, description: cat.description,
    iconUrl: cat.iconUrl, isActive: cat.isActive, sortOrder: cat.sortOrder,
    productCount: cat._count?.products ?? 0, createdAt: cat.createdAt, updatedAt: cat.updatedAt,
  };
}

export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async getAll(options: { isActive?: boolean; page?: number; limit?: number; keyword?: string } = {}) {
    const { categories, total, page, limit } = await this.categoryRepo.findAll(options);
    return { categories: categories.map(mapCategoryToDto), total, page, limit };
  }

  async getById(id: string): Promise<CategoryResponseDto> {
    const cat = await this.categoryRepo.findById(id);
    if (!cat) throw new AppError('Category not found', 404);
    return mapCategoryToDto(cat);
  }

  async getBySlug(slug: string): Promise<CategoryResponseDto> {
    const cat = await this.categoryRepo.findBySlug(slug);
    if (!cat) throw new AppError('Category not found', 404);
    return mapCategoryToDto(cat);
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const existingName = await this.categoryRepo.findByName(dto.name);
    if (existingName) throw new AppError('Category with this name already exists', 409);

    let slug = dto.slug ?? generateSlug(dto.name);
    const existingSlug = await this.categoryRepo.findBySlug(slug);
    if (existingSlug) {
      const allSlugs = await this.categoryRepo.getAllSlugs();
      slug = generateUniqueSlug(dto.name, allSlugs);
    }

    const cat = await this.categoryRepo.create({
      name: dto.name, slug,
      description: dto.description,
      iconUrl: dto.iconUrl,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });
    return mapCategoryToDto(cat);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) throw new AppError('Category not found', 404);

    if (dto.name && dto.name !== existing.name) {
      const nameConflict = await this.categoryRepo.findByName(dto.name);
      if (nameConflict && nameConflict.id !== id) throw new AppError('Category with this name already exists', 409);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const slugConflict = await this.categoryRepo.findBySlug(dto.slug);
      if (slugConflict && slugConflict.id !== id) throw new AppError('Category with this slug already exists', 409);
    }

    const cat = await this.categoryRepo.update(id, {
      name: dto.name,
      slug: dto.slug ?? (dto.name ? generateSlug(dto.name) : existing.slug),
      description: dto.description,
      iconUrl: dto.iconUrl,
      isActive: dto.isActive,
      sortOrder: dto.sortOrder,
    });
    return mapCategoryToDto(cat);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) throw new AppError('Category not found', 404);
    await this.categoryRepo.softDelete(id);
  }
}
