import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { CategoryRepository } from '../repositories/category.repository';
import { ResponseHelper } from '../utils/response';

const categoryService = new CategoryService(new CategoryRepository());

export class CategoryController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, keyword, isActive } = req.query as {
        page?: string; limit?: string; keyword?: string; isActive?: string;
      };
      const result = await categoryService.getAll({
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        keyword,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      });
      ResponseHelper.paginate(res, 'Categories retrieved successfully', result.categories, result.total, result.page, result.limit);
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cat = await categoryService.getById(req.params.id);
      ResponseHelper.success(res, 'Category retrieved successfully', cat);
    } catch (err) { next(err); }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cat = await categoryService.getBySlug(req.params.slug);
      ResponseHelper.success(res, 'Category retrieved successfully', cat);
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cat = await categoryService.create(req.body);
      ResponseHelper.created(res, 'Category created successfully', cat);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cat = await categoryService.update(req.params.id, req.body);
      ResponseHelper.success(res, 'Category updated successfully', cat);
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoryService.delete(req.params.id);
      ResponseHelper.success(res, 'Category deleted successfully');
    } catch (err) { next(err); }
  }
}
