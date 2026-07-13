import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { ResponseHelper } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { Role } from '@prisma/client';

const userService = new UserService(new UserRepository());

export class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getProfile(req.user!.userId);
      ResponseHelper.success(res, 'Profile retrieved successfully', user);
    } catch (err) { next(err); }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateProfile(req.user!.userId, req.body);
      ResponseHelper.success(res, 'Profile updated successfully', user);
    } catch (err) { next(err); }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.changePassword(req.user!.userId, req.body);
      ResponseHelper.success(res, 'Password changed successfully');
    } catch (err) { next(err); }
  }

  // Admin endpoints
  async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, keyword, role, isActive } = req.query as {
        page?: string; limit?: string; keyword?: string; role?: Role; isActive?: string;
      };
      const result = await userService.getAllUsers({
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        keyword,
        role,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      });
      ResponseHelper.paginate(res, 'Users retrieved successfully', result.users, result.total, result.page, result.limit);
    } catch (err) { next(err); }
  }

  async getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);
      ResponseHelper.success(res, 'User retrieved successfully', user);
    } catch (err) { next(err); }
  }

  async adminUpdateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.adminUpdateUser(req.params.id, req.body);
      ResponseHelper.success(res, 'User updated successfully', user);
    } catch (err) { next(err); }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteUser(req.params.id);
      ResponseHelper.success(res, 'User deleted successfully');
    } catch (err) { next(err); }
  }
}
