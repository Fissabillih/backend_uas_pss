export interface UpdateStoreProfileDto {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
  openMonFri?: string;
  openSaturday?: string;
  openSunday?: string;
  isDeliveryFree?: boolean;
  deliveryNote?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
}

export interface StoreProfileResponseDto {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  province: string;
  postalCode: string | null;
  phone: string;
  email: string | null;
  website: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  openMonFri: string;
  openSaturday: string;
  openSunday: string;
  isDeliveryFree: boolean;
  deliveryNote: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  whatsappNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}
