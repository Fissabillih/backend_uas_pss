import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { env } from '../config/env';
import { AppError } from './error.middleware';

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createStorage(subfolder: string): multer.StorageEngine {
  return multer.diskStorage({
    destination: (_req: Request, _file, cb) => {
      const uploadPath = path.join(process.cwd(), 'src', 'uploads', subfolder);
      ensureDir(uploadPath);
      cb(null, uploadPath);
    },
    filename: (_req: Request, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      const baseName = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9]/g, '-')
        .substring(0, 50);
      cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
  });
}

function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  const allowedTypes = env.UPLOAD_ALLOWED_TYPES.split(',').map((t) => t.trim());
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`, 400));
  }
}

export const uploadProductImage = multer({
  storage: createStorage('products'),
  limits: { fileSize: env.UPLOAD_MAX_SIZE },
  fileFilter,
}).single('image');

export const uploadBannerImage = multer({
  storage: createStorage('banners'),
  limits: { fileSize: env.UPLOAD_MAX_SIZE },
  fileFilter,
}).single('image');

export function getFileUrl(req: Request, subfolder: string, filename: string): string {
  return `${req.protocol}://${req.get('host')}/uploads/${subfolder}/${filename}`;
}
