import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../utils/jwt';
import { env } from '../config/env';

const tokenRepo = new RefreshTokenRepository();

export class GoogleAuthController {
  async callback(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as User;

      if (!user) {
        res.redirect(`${env.FRONTEND_URL}/login?error=google_auth_failed`);
        return;
      }

      // Admin tidak boleh login via Google
      if (user.role === 'ADMIN') {
        res.redirect(`${env.FRONTEND_URL}/login?error=admin_google_not_allowed`);
        return;
      }

      const payload = { userId: user.id, email: user.email, role: user.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await tokenRepo.create({
        token: refreshToken,
        user: { connect: { id: user.id } },
        expiresAt: getRefreshTokenExpiry(),
        ipAddress: req.ip ?? req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      // Redirect ke frontend dengan token di query string
      // Frontend akan menyimpan token dan redirect ke halaman yang sesuai
      const params = new URLSearchParams({
        accessToken,
        refreshToken,
      });

      res.redirect(`${env.FRONTEND_URL}/auth/google/callback?${params.toString()}`);
    } catch {
      res.redirect(`${env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
  }
}
