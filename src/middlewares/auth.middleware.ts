import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyAccessToken } from '../utils/jwt';
import { ResponseHelper } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ResponseHelper.unauthorized(res, 'Access token is required');
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    ResponseHelper.unauthorized(res, 'Invalid or expired access token');
  }
}

export function authorize(...roles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseHelper.unauthorized(res, 'Authentication required');
      return;
    }
    if (!roles.includes(req.user.role)) {
      ResponseHelper.forbidden(res, 'You do not have permission to access this resource');
      return;
    }
    next();
  };
}

export function optionalAuthenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyAccessToken(token);
      req.user = { userId: payload.userId, email: payload.email, role: payload.role };
    }
  } catch {
    // silently ignore invalid token in optional auth
  }
  next();
}
