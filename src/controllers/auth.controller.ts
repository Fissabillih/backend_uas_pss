import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { ResponseHelper } from '../utils/response';
import { AuthenticatedRequest } from '../types';

const authService = new AuthService(new UserRepository(), new RefreshTokenRepository());

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(
        req.body,
        req.ip ?? req.socket.remoteAddress,
        req.headers['user-agent'],
      );
      ResponseHelper.created(res, 'Registration successful', result);
    } catch (err) { next(err); }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(
        req.body,
        req.ip ?? req.socket.remoteAddress,
        req.headers['user-agent'],
      );
      ResponseHelper.success(res, 'Login successful', result);
    } catch (err) { next(err); }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) await authService.logout(refreshToken);
      ResponseHelper.success(res, 'Logout successful');
    } catch (err) { next(err); }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshTokens(
        refreshToken,
        req.ip ?? req.socket.remoteAddress,
        req.headers['user-agent'],
      );
      ResponseHelper.success(res, 'Token refreshed successfully', tokens);
    } catch (err) { next(err); }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRepo = new UserRepository();
      const user = await userRepo.findById(req.user!.userId);
      if (!user) {
        ResponseHelper.notFound(res, 'User not found');
        return;
      }
      const { password: _, deletedAt: __, ...safeUser } = user;
      ResponseHelper.success(res, 'Profile retrieved successfully', safeUser);
    } catch (err) { next(err); }
  }
}
