import { Prisma, StoreProfile } from '@prisma/client';
import prisma from '../config/database';

export class StoreProfileRepository {
  async findFirst(): Promise<StoreProfile | null> {
    return prisma.storeProfile.findFirst();
  }

  async upsert(data: Prisma.StoreProfileCreateInput): Promise<StoreProfile> {
    const existing = await this.findFirst();
    if (existing) {
      return prisma.storeProfile.update({
        where: { id: existing.id },
        data,
      });
    }
    return prisma.storeProfile.create({ data });
  }

  async update(id: string, data: Prisma.StoreProfileUpdateInput): Promise<StoreProfile> {
    return prisma.storeProfile.update({ where: { id }, data });
  }
}
