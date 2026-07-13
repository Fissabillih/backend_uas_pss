import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta | Record<string, unknown>;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ProductFilters {
  categoryId?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  isFeatured?: boolean;
}

export type SortOrder = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'alphabetical';

export interface ProductQueryParams extends PaginationQuery {
  categoryId?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  isFeatured?: boolean;
  sort?: SortOrder;
}

export type JwtPayload = AuthPayload & { iat?: number; exp?: number };
