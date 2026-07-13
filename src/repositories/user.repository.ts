import { Prisma, User, Role } from '@prisma/client';
import prisma from '../config/database';
import { parsePagination } from '../utils/pagination';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { id, deletedAt: null } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<User> {
    return prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    keyword?: string;
    role?: Role;
    isActive?: boolean;
  }) {
    const { page, limit, skip } = parsePagination(options);
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(options.role && { role: options.role }),
      ...(options.isActive !== undefined && { isActive: options.isActive }),
      ...(options.keyword && {
        OR: [
          { name: { contains: options.keyword } },
          { email: { contains: options.keyword } },
          { phone: { contains: options.keyword } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, phone: true, address: true,
          avatarUrl: true, role: true, isActive: true, createdAt: true, updatedAt: true,
          deletedAt: true, password: false,
        },
      }),
      prisma.user.count({ where }),
    ]);
    return { users, total, page, limit };
  }

  async countAll(): Promise<number> {
    return prisma.user.count({ where: { deletedAt: null } });
  }

  async countByRole(role: Role): Promise<number> {
    return prisma.user.count({ where: { role, deletedAt: null } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { googleId, deletedAt: null } });
  }

  async linkGoogleId(id: string, googleId: string): Promise<User> {
    return prisma.user.update({ where: { id }, data: { googleId } });
  }

  async createGoogleUser(data: {
    googleId: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    role: Role;
    isActive: boolean;
  }): Promise<User> {
    return prisma.user.create({ data });
  }
}
