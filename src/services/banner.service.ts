import { BannerRepository } from '../repositories/banner.repository';
import { AppError } from '../middlewares/error.middleware';
import { CreateBannerDto, UpdateBannerDto, BannerResponseDto } from '../dto/banner.dto';
import { Banner } from '@prisma/client';

function mapBannerToDto(b: Banner): BannerResponseDto {
  return {
    id: b.id, title: b.title, subtitle: b.subtitle, imageUrl: b.imageUrl,
    linkUrl: b.linkUrl, isActive: b.isActive, sortOrder: b.sortOrder,
    startDate: b.startDate, endDate: b.endDate,
    createdAt: b.createdAt, updatedAt: b.updatedAt,
  };
}

export class BannerService {
  constructor(private readonly bannerRepo: BannerRepository) {}

  async getAll(options: { page?: number; limit?: number; isActive?: boolean } = {}) {
    const { banners, total, page, limit } = await this.bannerRepo.findAll(options);
    return { banners: banners.map(mapBannerToDto), total, page, limit };
  }

  async getActive(): Promise<BannerResponseDto[]> {
    const banners = await this.bannerRepo.findActive();
    return banners.map(mapBannerToDto);
  }

  async getById(id: string): Promise<BannerResponseDto> {
    const banner = await this.bannerRepo.findById(id);
    if (!banner) throw new AppError('Banner not found', 404);
    return mapBannerToDto(banner);
  }

  async create(dto: CreateBannerDto): Promise<BannerResponseDto> {
    const banner = await this.bannerRepo.create({
      title: dto.title, subtitle: dto.subtitle, imageUrl: dto.imageUrl,
      linkUrl: dto.linkUrl, isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
      startDate: dto.startDate, endDate: dto.endDate,
    });
    return mapBannerToDto(banner);
  }

  async update(id: string, dto: UpdateBannerDto): Promise<BannerResponseDto> {
    const existing = await this.bannerRepo.findById(id);
    if (!existing) throw new AppError('Banner not found', 404);

    const banner = await this.bannerRepo.update(id, {
      title: dto.title, subtitle: dto.subtitle, imageUrl: dto.imageUrl,
      linkUrl: dto.linkUrl, isActive: dto.isActive, sortOrder: dto.sortOrder,
      startDate: dto.startDate, endDate: dto.endDate,
    });
    return mapBannerToDto(banner);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.bannerRepo.findById(id);
    if (!existing) throw new AppError('Banner not found', 404);
    await this.bannerRepo.softDelete(id);
  }

  async updateImage(id: string, imageUrl: string): Promise<BannerResponseDto> {
    const existing = await this.bannerRepo.findById(id);
    if (!existing) throw new AppError('Banner not found', 404);
    const banner = await this.bannerRepo.update(id, { imageUrl });
    return mapBannerToDto(banner);
  }
}
