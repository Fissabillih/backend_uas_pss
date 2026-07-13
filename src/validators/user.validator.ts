import { z } from 'zod';
import { Role } from '@prisma/client';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    phone: z
      .string()
      .regex(/^(\+62|62|0)[0-9]{8,12}$/, 'Invalid Indonesian phone number')
      .optional(),
    address: z.string().max(500).optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({ required_error: 'Current password is required' }).min(1),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase and number',
      ),
  }),
});

export const adminUpdateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    email: z.string().email().toLowerCase().trim().optional(),
    phone: z
      .string()
      .regex(/^(\+62|62|0)[0-9]{8,12}$/, 'Invalid Indonesian phone number')
      .optional(),
    address: z.string().max(500).optional(),
    role: z.nativeEnum(Role).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>['body'];
