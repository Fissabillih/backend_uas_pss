import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Category name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .trim(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
      .optional(),
    description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
    iconUrl: z.string().url('Invalid URL format').optional(),
    isActive: z.boolean().default(true),
    sortOrder: z.number().int().min(0).default(0),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
      .optional(),
    description: z.string().max(500).optional(),
    iconUrl: z.string().url('Invalid URL format').optional().nullable(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
  }),
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>['body'];
