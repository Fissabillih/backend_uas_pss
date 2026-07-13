import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../repositories/product.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { FavoriteRepository } from '../repositories/favorite.repository';
import { ResponseHelper } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { getFileUrl } from '../middlewares/upload.middleware';
import { ProductQueryInput } from '../validators/product.validator';
import { SortOrder } from '../types';

const productService = new ProductService(
  new ProductRepository(),
  new CategoryRepository(),
  new FavoriteRepository(),
);

export class ProductController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = req.query as unknown as ProductQueryInput;
      const params = {
        page: q.page, limit: q.limit,
        categoryId: q.categoryId as string | undefined,
        keyword: q.keyword as string | undefined,
        minPrice: q.minPrice as number | undefined,
        maxPrice: q.maxPrice as number | undefined,
        status: q.status as string | undefined,
        isFeatured: q.isFeatured as boolean | undefined,
        sort: q.sort as SortOrder | undefined,
      };
      const result = await productService.getAll(params, req.user?.userId);
      ResponseHelper.paginate(res, 'Products retrieved successfully', result.products, result.total, result.page, result.limit);
    } catch (err) { next(err); }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getById(req.params.id, req.user?.userId);
      ResponseHelper.success(res, 'Product retrieved successfully', product);
    } catch (err) { next(err); }
  }

  async getBySlug(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getBySlug(req.params.slug, req.user?.userId);
      ResponseHelper.success(res, 'Product retrieved successfully', product);
    } catch (err) { next(err); }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
      const products = await productService.getFeatured(limit);
      ResponseHelper.success(res, 'Featured products retrieved successfully', products);
    } catch (err) { next(err); }
  }

  async getNewest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
      const products = await productService.getNewest(limit);
      ResponseHelper.success(res, 'Newest products retrieved successfully', products);
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = { ...req.body };
      if (req.file) {
        body.imageUrl = getFileUrl(req, 'products', req.file.filename);
      }
      if (body.price) body.price = parseFloat(body.price);
      if (body.stock) body.stock = parseInt(body.stock, 10);
      if (body.weight) body.weight = parseFloat(body.weight);
      if (body.isFeatured) body.isFeatured = body.isFeatured === 'true' || body.isFeatured === true;

      const product = await productService.create(body);
      ResponseHelper.created(res, 'Product created successfully', product);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = { ...req.body };
      if (req.file) body.imageUrl = getFileUrl(req, 'products', req.file.filename);
      if (body.price) body.price = parseFloat(body.price);
      if (body.stock) body.stock = parseInt(body.stock, 10);
      if (body.weight) body.weight = parseFloat(body.weight);
      if (body.isFeatured !== undefined) body.isFeatured = body.isFeatured === 'true' || body.isFeatured === true;

      const product = await productService.update(req.params.id, body);
      ResponseHelper.success(res, 'Product updated successfully', product);
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.delete(req.params.id);
      ResponseHelper.success(res, 'Product deleted successfully');
    } catch (err) { next(err); }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        ResponseHelper.error(res, 'No image file provided', undefined, 400);
        return;
      }
      const imageUrl = getFileUrl(req, 'products', req.file.filename);
      const product = await productService.updateImage(req.params.id, imageUrl);
      ResponseHelper.success(res, 'Product image uploaded successfully', product);
    } catch (err) { next(err); }
  }
}
