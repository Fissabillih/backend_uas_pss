import { Request, Response, NextFunction } from 'express';
import { BannerService } from '../services/banner.service';
import { BannerRepository } from '../repositories/banner.repository';
import { ResponseHelper } from '../utils/response';
import { getFileUrl } from '../middlewares/upload.middleware';

const bannerService = new BannerService(new BannerRepository());

export class BannerController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, isActive } = req.query as { page?: string; limit?: string; isActive?: string };
      const result = await bannerService.getAll({
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      });
      ResponseHelper.paginate(res, 'Banners retrieved successfully', result.banners, result.total, result.page, result.limit);
    } catch (err) { next(err); }
  }

  async getActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banners = await bannerService.getActive();
      ResponseHelper.success(res, 'Active banners retrieved successfully', banners);
    } catch (err) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banner = await bannerService.getById(req.params.id);
      ResponseHelper.success(res, 'Banner retrieved successfully', banner);
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = { ...req.body };
      if (req.file) body.imageUrl = getFileUrl(req, 'banners', req.file.filename);
      if (body.sortOrder) body.sortOrder = parseInt(body.sortOrder, 10);
      if (body.isActive !== undefined) body.isActive = body.isActive === 'true' || body.isActive === true;

      const banner = await bannerService.create(body);
      ResponseHelper.created(res, 'Banner created successfully', banner);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = { ...req.body };
      if (req.file) body.imageUrl = getFileUrl(req, 'banners', req.file.filename);
      if (body.sortOrder !== undefined) body.sortOrder = parseInt(body.sortOrder, 10);
      if (body.isActive !== undefined) body.isActive = body.isActive === 'true' || body.isActive === true;

      const banner = await bannerService.update(req.params.id, body);
      ResponseHelper.success(res, 'Banner updated successfully', banner);
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await bannerService.delete(req.params.id);
      ResponseHelper.success(res, 'Banner deleted successfully');
    } catch (err) { next(err); }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        ResponseHelper.error(res, 'No image file provided', undefined, 400);
        return;
      }
      const imageUrl = getFileUrl(req, 'banners', req.file.filename);
      const banner = await bannerService.updateImage(req.params.id, imageUrl);
      ResponseHelper.success(res, 'Banner image uploaded successfully', banner);
    } catch (err) { next(err); }
  }
}
