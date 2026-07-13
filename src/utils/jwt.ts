import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthPayload, JwtPayload } from '../types';

export function generateAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function generateRefreshToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

export function getRefreshTokenExpiry(): Date {
  // Parse duration string like "7d", "24h", "60m"
  const duration = env.JWT_REFRESH_EXPIRES_IN;
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1), 10);
  const now = new Date();

  switch (unit) {
    case 'd':
      now.setDate(now.getDate() + value);
      break;
    case 'h':
      now.setHours(now.getHours() + value);
      break;
    case 'm':
      now.setMinutes(now.getMinutes() + value);
      break;
    default:
      now.setDate(now.getDate() + 7);
  }
  return now;
}
