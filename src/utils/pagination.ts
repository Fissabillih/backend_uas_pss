import { env } from '../config/env';

export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(options: PaginationOptions): PaginationResult {
  const page = Math.max(1, parseInt(String(options.page ?? env.DEFAULT_PAGE), 10) || 1);
  const rawLimit = parseInt(String(options.limit ?? env.DEFAULT_LIMIT), 10) || env.DEFAULT_LIMIT;
  const limit = Math.min(Math.max(1, rawLimit), env.MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
