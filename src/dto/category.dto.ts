export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
