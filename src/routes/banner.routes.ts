/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management
 */
import { Router } from 'express';
import { BannerController } from '../controllers/banner.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { uploadBannerImage } from '../middlewares/upload.middleware';
import { createBannerSchema, updateBannerSchema, bannerIdSchema } from '../validators/banner.validator';

const router = Router();
const ctrl = new BannerController();

/**
 * @swagger
 * /banners:
 *   get:
 *     tags: [Banners]
 *     summary: Get all banners
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of banners
 */
router.get('/', ctrl.getAll.bind(ctrl));

/**
 * @swagger
 * /banners/active:
 *   get:
 *     tags: [Banners]
 *     summary: Get active banners (public, date-filtered)
 *     responses:
 *       200:
 *         description: Active banners
 */
router.get('/active', ctrl.getActive.bind(ctrl));

/**
 * @swagger
 * /banners/{id}:
 *   get:
 *     tags: [Banners]
 *     summary: Get banner by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Banner details
 *       404:
 *         description: Not found
 */
router.get('/:id', validate(bannerIdSchema), ctrl.getById.bind(ctrl));

// Admin routes
/**
 * @swagger
 * /banners:
 *   post:
 *     tags: [Banners]
 *     summary: Create banner (Admin)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, imageUrl]
 *             properties:
 *               title: { type: string }
 *               subtitle: { type: string }
 *               imageUrl: { type: string }
 *               linkUrl: { type: string }
 *               isActive: { type: boolean }
 *               sortOrder: { type: integer }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Banner created
 */
router.post('/', authenticate, authorize('ADMIN'), uploadBannerImage, ctrl.create.bind(ctrl));

/**
 * @swagger
 * /banners/{id}:
 *   put:
 *     tags: [Banners]
 *     summary: Update banner (Admin)
 *     security:
 *       - BearerAuth: []
 */
router.put('/:id', authenticate, authorize('ADMIN'), uploadBannerImage, validate(updateBannerSchema), ctrl.update.bind(ctrl));

/**
 * @swagger
 * /banners/{id}/image:
 *   post:
 *     tags: [Banners]
 *     summary: Upload banner image (Admin)
 *     security:
 *       - BearerAuth: []
 */
router.post('/:id/image', authenticate, authorize('ADMIN'), uploadBannerImage, ctrl.uploadImage.bind(ctrl));

/**
 * @swagger
 * /banners/{id}:
 *   delete:
 *     tags: [Banners]
 *     summary: Delete banner (Admin, soft delete)
 *     security:
 *       - BearerAuth: []
 */
router.delete('/:id', authenticate, authorize('ADMIN'), validate(bannerIdSchema), ctrl.delete.bind(ctrl));

export default router;
