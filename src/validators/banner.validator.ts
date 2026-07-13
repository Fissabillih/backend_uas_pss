import { z } from 'zod';

export const createBannerSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title must not exceed 200 characters')
      .trim(),
    subtitle: z.string().max(300).optional(),
    imageUrl: z
      .string({ required_error: 'Image URL is required' })
      .url('Invalid URL format'),
    linkUrl: z.string().url('Invalid URL format').optional(),
    isActive: z.boolean().default(true),
    sortOrder: z.number().int().min(0).default(0),
    startDate: z.string().datetime().optional().transform((v) => v ? new Date(v) : undefined),
    endDate: z.string().datetime().optional().transform((v) => v ? new Date(v) : undefined),
  }),
});

export const updateBannerSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid banner ID'),
  }),
  body: z.object({
    title: z.string().min(2).max(200).trim().optional(),
    subtitle: z.string().max(300).optional().nullable(),
    imageUrl: z.string().url('Invalid URL format').optional(),
    linkUrl: z.string().url('Invalid URL format').optional().nullable(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
    startDate: z.string().datetime().optional().nullable().transform((v) => v ? new Date(v) : null),
    endDate: z.string().datetime().optional().nullable().transform((v) => v ? new Date(v) : null),
  }),
});

export const bannerIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid banner ID'),
  }),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>['body'];
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>['body'];
