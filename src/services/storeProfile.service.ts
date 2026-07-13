import { StoreProfileRepository } from '../repositories/storeProfile.repository';
import { AppError } from '../middlewares/error.middleware';
import { UpdateStoreProfileDto, StoreProfileResponseDto } from '../dto/store.dto';
import { StoreProfile } from '@prisma/client';

function mapToDto(s: StoreProfile): StoreProfileResponseDto {
  return {
    id: s.id, name: s.name, description: s.description, address: s.address,
    city: s.city, province: s.province, postalCode: s.postalCode, phone: s.phone,
    email: s.email, website: s.website, logoUrl: s.logoUrl, bannerUrl: s.bannerUrl,
    openMonFri: s.openMonFri, openSaturday: s.openSaturday, openSunday: s.openSunday,
    isDeliveryFree: s.isDeliveryFree, deliveryNote: s.deliveryNote,
    facebookUrl: s.facebookUrl, instagramUrl: s.instagramUrl,
    whatsappNumber: s.whatsappNumber, createdAt: s.createdAt, updatedAt: s.updatedAt,
  };
}

export class StoreProfileService {
  constructor(private readonly storeRepo: StoreProfileRepository) {}

  async get(): Promise<StoreProfileResponseDto> {
    const profile = await this.storeRepo.findFirst();
    if (!profile) throw new AppError('Store profile not found', 404);
    return mapToDto(profile);
  }

  async update(dto: UpdateStoreProfileDto): Promise<StoreProfileResponseDto> {
    const profile = await this.storeRepo.findFirst();
    if (!profile) throw new AppError('Store profile not found', 404);

    const updated = await this.storeRepo.update(profile.id, {
      name: dto.name, description: dto.description, address: dto.address,
      city: dto.city, province: dto.province, postalCode: dto.postalCode,
      phone: dto.phone, email: dto.email, website: dto.website,
      logoUrl: dto.logoUrl, bannerUrl: dto.bannerUrl,
      openMonFri: dto.openMonFri, openSaturday: dto.openSaturday, openSunday: dto.openSunday,
      isDeliveryFree: dto.isDeliveryFree, deliveryNote: dto.deliveryNote,
      facebookUrl: dto.facebookUrl, instagramUrl: dto.instagramUrl,
      whatsappNumber: dto.whatsappNumber,
    });
    return mapToDto(updated);
  }
}
