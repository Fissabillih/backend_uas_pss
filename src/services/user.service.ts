import { Role } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../middlewares/error.middleware';
import { UpdateProfileDto, ChangePasswordDto, AdminUpdateUserDto, UserResponseDto } from '../dto/user.dto';
import { comparePassword, hashPassword } from '../utils/hash';

function mapUserToDto(user: {
  id: string; name: string; email: string; phone: string | null; address: string | null;
  avatarUrl: string | null; role: Role; isActive: boolean; createdAt: Date; updatedAt: Date;
}): UserResponseDto {
  return {
    id: user.id, name: user.name, email: user.email, phone: user.phone,
    address: user.address, avatarUrl: user.avatarUrl, role: user.role,
    isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt,
  };
}

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return mapUserToDto(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserResponseDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const updated = await this.userRepo.update(userId, {
      name: dto.name,
      phone: dto.phone,
      address: dto.address,
      avatarUrl: dto.avatarUrl,
    });
    return mapUserToDto(updated);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await comparePassword(dto.currentPassword, user.password);
    if (!isMatch) throw new AppError('Current password is incorrect', 400);

    const hashed = await hashPassword(dto.newPassword);
    await this.userRepo.update(userId, { password: hashed });
  }

  // Admin methods
  async getAllUsers(options: { page?: number; limit?: number; keyword?: string; role?: Role; isActive?: boolean }) {
    const { users, total, page, limit } = await this.userRepo.findAll(options);
    return { users: users.map(mapUserToDto), total, page, limit };
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return mapUserToDto(user);
  }

  async adminUpdateUser(id: string, dto: AdminUpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError('User not found', 404);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findByEmail(dto.email);
      if (existing) throw new AppError('Email is already in use', 409);
    }

    const updated = await this.userRepo.update(id, {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      role: dto.role,
      isActive: dto.isActive,
    });
    return mapUserToDto(updated);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError('User not found', 404);
    await this.userRepo.softDelete(id);
  }
}
