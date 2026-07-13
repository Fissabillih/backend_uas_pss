import { z } from 'zod';
import { ProductStatus } from '@prisma/client';

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Product name is required' })
      .min(3, 'Name must be at least 3 characters')
      .max(200, 'Name must not exceed 200 characters')
      .trim(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
      .optional(),
    description: z.string().max(2000, 'Description must not exceed 2000 characters').optional(),
    price: z
      .number({ required_error: 'Price is required' })
      .min(0, 'Price must be non-negative')
      .max(999999999999, 'Price exceeds maximum allowed value'),
    stock: z
      .number({ required_error: 'Stock is required' })
      .int('Stock must be an integer')
      .min(0, 'Stock must be non-negative'),
    weight: z.number().min(0, 'Weight must be non-negative').optional(),
    imageUrl: z.string().url('Invalid URL format').optional(),
    status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),
    isFeatured: z.boolean().default(false),
    categoryId: z.string({ required_error: 'Category ID is required' }).uuid('Invalid category ID'),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    name: z.string().min(3).max(200).trim().optional(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
      .optional(),
    description: z.string().max(2000).optional(),
    price: z.number().min(0).max(999999999999).optional(),
    stock: z.number().int().min(0).optional(),
    weight: z.number().min(0).optional().nullable(),
    imageUrl: z.string().url('Invalid URL format').optional().nullable(),
    status: z.nativeEnum(ProductStatus).optional(),
    isFeatured: z.boolean().optional(),
    categoryId: z.string().uuid('Invalid category ID').optional(),
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
    limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
    categoryId: z.string().uuid().optional(),
    keyword: z.string().max(200).optional(),
    minPrice: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
    maxPrice: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
    status: z.nativeEnum(ProductStatus).optional(),
    isFeatured: z
      .string()
      .optional()
      .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
    sort: z
      .enum(['newest', 'oldest', 'price_asc', 'price_desc', 'alphabetical'])
      .optional(),
  }),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type ProductQueryInput = z.infer<typeof productQuerySchema>['query'];
