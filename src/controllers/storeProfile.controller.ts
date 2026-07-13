import { Request, Response, NextFunction } from 'express';
import { StoreProfileService } from '../services/storeProfile.service';
import { StoreProfileRepository } from '../repositories/storeProfile.repository';
import { ResponseHelper } from '../utils/response';

const storeProfileService = new StoreProfileService(new StoreProfileRepository());

export class StoreProfileController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await storeProfileService.get();
      ResponseHelper.success(res, 'Store profile retrieved successfully', profile);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await storeProfileService.update(req.body);
      ResponseHelper.success(res, 'Store profile updated successfully', profile);
    } catch (err) { next(err); }
  }
}
