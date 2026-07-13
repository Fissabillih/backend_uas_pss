import { z } from 'zod';

export const updateStoreProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).trim().optional(),
    description: z.string().max(2000).optional(),
    address: z.string().min(5).max(500).optional(),
    city: z.string().min(2).max(100).optional(),
    province: z.string().min(2).max(100).optional(),
    postalCode: z.string().regex(/^\d{5}$/, 'Postal code must be 5 digits').optional(),
    phone: z
      .string()
      .regex(/^(\+62|62|0)[0-9]{8,12}$/, 'Invalid Indonesian phone number')
      .optional(),
    email: z.string().email('Invalid email format').optional(),
    website: z.string().url('Invalid URL format').optional(),
    logoUrl: z.string().url('Invalid URL format').optional().nullable(),
    bannerUrl: z.string().url('Invalid URL format').optional().nullable(),
    openMonFri: z.string().max(20).optional(),
    openSaturday: z.string().max(20).optional(),
    openSunday: z.string().max(20).optional(),
    isDeliveryFree: z.boolean().optional(),
    deliveryNote: z.string().max(500).optional(),
    facebookUrl: z.string().url('Invalid URL format').optional().nullable(),
    instagramUrl: z.string().url('Invalid URL format').optional().nullable(),
    whatsappNumber: z
      .string()
      .regex(/^(\+62|62|0)[0-9]{8,12}$/, 'Invalid WhatsApp number')
      .optional(),
  }),
});

export type UpdateStoreProfileInput = z.infer<typeof updateStoreProfileSchema>['body'];
