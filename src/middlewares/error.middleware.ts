import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { logger } from '../config/logger';
import { ResponseHelper } from '../utils/response';
import { ValidationError } from '../types';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error(`[${req.method}] ${req.path} - ${err.message}`, {
    stack: err.stack,
    body: req.body,
  });

  // Operational errors
  if (err instanceof AppError) {
    ResponseHelper.error(res, err.message, undefined, err.statusCode);
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors: ValidationError[] = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    ResponseHelper.error(res, 'Validation failed', errors, 422);
    return;
  }

  // JWT errors
  if (err instanceof TokenExpiredError) {
    ResponseHelper.unauthorized(res, 'Token has expired');
    return;
  }
  if (err instanceof JsonWebTokenError) {
    ResponseHelper.unauthorized(res, 'Invalid token');
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[])?.join(', ') ?? 'field';
        ResponseHelper.conflict(res, `A record with this ${target} already exists`);
        return;
      }
      case 'P2025':
        ResponseHelper.notFound(res, 'Record not found');
        return;
      case 'P2003':
        ResponseHelper.error(res, 'Foreign key constraint violation', undefined, 400);
        return;
      default:
        ResponseHelper.error(res, 'Database error occurred', undefined, 400);
        return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    ResponseHelper.error(res, 'Invalid data provided', undefined, 400);
    return;
  }

  // Multer errors
  if (err.name === 'MulterError') {
    ResponseHelper.error(res, err.message, undefined, 400);
    return;
  }

  // Unknown errors
  ResponseHelper.serverError(res, 'An unexpected error occurred');
}

export function notFoundHandler(req: Request, res: Response): void {
  ResponseHelper.notFound(res, `Route ${req.method} ${req.path} not found`);
}
