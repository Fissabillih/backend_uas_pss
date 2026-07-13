import { Role } from '@prisma/client';

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface AdminUpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: Role;
  isActive?: boolean;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
