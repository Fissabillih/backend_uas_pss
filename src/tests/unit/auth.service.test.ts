import { AuthService } from '../../services/auth.service';
import { UserRepository } from '../../repositories/user.repository';
import { RefreshTokenRepository } from '../../repositories/refreshToken.repository';
import { AppError } from '../../middlewares/error.middleware';
import * as hashUtils from '../../utils/hash';
import * as jwtUtils from '../../utils/jwt';

jest.mock('../../repositories/user.repository');
jest.mock('../../repositories/refreshToken.repository');
jest.mock('../../utils/hash');
jest.mock('../../utils/jwt');

const MockUserRepo = UserRepository as jest.MockedClass<typeof UserRepository>;
const MockTokenRepo = RefreshTokenRepository as jest.MockedClass<typeof RefreshTokenRepository>;

describe('AuthService', () => {
  let authService: AuthService;
  let userRepo: jest.Mocked<UserRepository>;
  let tokenRepo: jest.Mocked<RefreshTokenRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepo = new MockUserRepo() as jest.Mocked<UserRepository>;
    tokenRepo = new MockTokenRepo() as jest.Mocked<RefreshTokenRepository>;
    authService = new AuthService(userRepo, tokenRepo);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto = { name: 'Test User', email: 'test@example.com', password: 'Password123' };

      userRepo.findByEmail.mockResolvedValue(null);
      (hashUtils.hashPassword as jest.Mock).mockResolvedValue('hashed_password');
      userRepo.create.mockResolvedValue({
        id: 'user-id-1', name: dto.name, email: dto.email,
        password: 'hashed_password', phone: null, address: null, avatarUrl: null,
        role: 'USER', isActive: true, deletedAt: null,
        createdAt: new Date(), updatedAt: new Date(),
      });
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('access_token');
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh_token');
      (jwtUtils.getRefreshTokenExpiry as jest.Mock).mockReturnValue(new Date());
      tokenRepo.create.mockResolvedValue({} as any);

      const result = await authService.register(dto);

      expect(result.user.email).toBe(dto.email);
      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
      expect(userRepo.create).toHaveBeenCalledTimes(1);
    });

    it('should throw 409 if email is already registered', async () => {
      userRepo.findByEmail.mockResolvedValue({ id: 'existing-id' } as any);

      await expect(
        authService.register({ name: 'Test', email: 'test@example.com', password: 'Pass123' }),
      ).rejects.toThrow(AppError);

      await expect(
        authService.register({ name: 'Test', email: 'test@example.com', password: 'Pass123' }),
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const dto = { email: 'test@example.com', password: 'Password123' };
      userRepo.findByEmail.mockResolvedValue({
        id: 'user-id', email: dto.email, password: 'hashed',
        name: 'Test', phone: null, address: null, avatarUrl: null,
        role: 'USER', isActive: true, deletedAt: null,
        createdAt: new Date(), updatedAt: new Date(),
      } as any);
      (hashUtils.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('access_token');
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh_token');
      (jwtUtils.getRefreshTokenExpiry as jest.Mock).mockReturnValue(new Date());
      tokenRepo.create.mockResolvedValue({} as any);

      const result = await authService.login(dto);
      expect(result.accessToken).toBe('access_token');
    });

    it('should throw 401 for wrong password', async () => {
      const dto = { email: 'test@example.com', password: 'WrongPassword' };
      userRepo.findByEmail.mockResolvedValue({ id: 'uid', password: 'hashed', isActive: true } as any);
      (hashUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(dto)).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw 401 for non-existent user', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(
        authService.login({ email: 'noone@example.com', password: 'pass' }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw 403 for inactive user', async () => {
      userRepo.findByEmail.mockResolvedValue({
        id: 'uid', password: 'hashed', isActive: false,
      } as any);
      (hashUtils.comparePassword as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.login({ email: 'test@example.com', password: 'pass' }),
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('logout', () => {
    it('should revoke refresh token on logout', async () => {
      tokenRepo.revokeToken.mockResolvedValue(undefined);
      await authService.logout('some_refresh_token');
      expect(tokenRepo.revokeToken).toHaveBeenCalledWith('some_refresh_token');
    });
  });
});
