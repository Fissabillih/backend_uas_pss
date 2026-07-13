export interface CreateBannerDto {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateBannerDto {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface BannerResponseDto {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
