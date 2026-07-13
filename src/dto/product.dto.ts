import { ProductStatus } from '@prisma/client';

export interface CreateProductDto {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  stock: number;
  weight?: number;
  imageUrl?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  categoryId: string;
}

export interface UpdateProductDto {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  weight?: number;
  imageUrl?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  categoryId?: string;
}

export interface ProductResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  weight: number | null;
  imageUrl: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  viewCount: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  isFavorited?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
