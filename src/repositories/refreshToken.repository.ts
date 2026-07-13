import { Prisma, RefreshToken } from '@prisma/client';
import prisma from '../config/database';

export class RefreshTokenRepository {
  async create(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findFirst({
      where: { token, isRevoked: false, expiresAt: { gt: new Date() } },
    });
  }

  async revokeToken(token: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  async deleteExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { OR: [{ expiresAt: { lt: new Date() } }, { isRevoked: true }] },
    });
  }

  async findActiveByUserId(userId: string): Promise<RefreshToken[]> {
    return prisma.refreshToken.findMany({
      where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
    });
  }
}
