import { Response } from 'express';
import { ApiResponse, PaginationMeta, ValidationError } from '../types';

export class ResponseHelper {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    meta?: PaginationMeta | Record<string, unknown>,
    statusCode = 200,
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, undefined, 201);
  }

  static error(
    res: Response,
    message: string,
    errors?: ValidationError[],
    statusCode = 400,
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  static notFound(res: Response, message = 'Resource not found'): Response {
    return this.error(res, message, undefined, 404);
  }

  static unauthorized(res: Response, message = 'Unauthorized'): Response {
    return this.error(res, message, undefined, 401);
  }

  static forbidden(res: Response, message = 'Forbidden'): Response {
    return this.error(res, message, undefined, 403);
  }

  static conflict(res: Response, message: string): Response {
    return this.error(res, message, undefined, 409);
  }

  static serverError(res: Response, message = 'Internal Server Error'): Response {
    return this.error(res, message, undefined, 500);
  }

  static paginate<T>(
    res: Response,
    message: string,
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): Response {
    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
    return this.success(res, message, data, meta);
  }
}
