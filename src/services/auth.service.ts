import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, getRefreshTokenExpiry } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dto/auth.dto';

export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenRepo: RefreshTokenRepository,
  ) {}

  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new AppError('Email address is already registered', 409);
    }

    const hashedPassword = await hashPassword(dto.password);
    const user = await this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      address: dto.address,
      role: 'USER',
      isActive: true,
    });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await this.tokenRepo.create({
      token: refreshToken,
      user: { connect: { id: user.id } },
      expiresAt: getRefreshTokenExpiry(),
      ipAddress,
      userAgent,
    });

    return {
      user: {
        id: user.id, name: user.name, email: user.email, phone: user.phone,
        address: user.address, avatarUrl: user.avatarUrl, role: user.role,
        isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.password || !(await comparePassword(dto.password, user.password))) {
      throw new AppError('Invalid email or password', 401);
    }
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Please contact support.', 403);
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await this.tokenRepo.create({
      token: refreshToken,
      user: { connect: { id: user.id } },
      expiresAt: getRefreshTokenExpiry(),
      ipAddress,
      userAgent,
    });

    return {
      user: {
        id: user.id, name: user.name, email: user.email, phone: user.phone,
        address: user.address, avatarUrl: user.avatarUrl, role: user.role,
        isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenRepo.revokeToken(refreshToken);
  }

  async refreshTokens(token: string, ipAddress?: string, userAgent?: string): Promise<{ accessToken: string; refreshToken: string }> {
    const storedToken = await this.tokenRepo.findByToken(token);
    if (!storedToken) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      await this.tokenRepo.revokeToken(token);
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await this.userRepo.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    // Rotate refresh token
    await this.tokenRepo.revokeToken(token);

    const newPayload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await this.tokenRepo.create({
      token: newRefreshToken,
      user: { connect: { id: user.id } },
      expiresAt: getRefreshTokenExpiry(),
      ipAddress,
      userAgent,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
