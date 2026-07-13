/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Store profile endpoints
 */
import { Router } from 'express';
import { StoreProfileController } from '../controllers/storeProfile.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { updateStoreProfileSchema } from '../validators/store.validator';

const router = Router();
const ctrl = new StoreProfileController();

/**
 * @swagger
 * /store:
 *   get:
 *     tags: [Store]
 *     summary: Get store profile (public)
 *     responses:
 *       200:
 *         description: Store profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreProfile'
 */
router.get('/', ctrl.get.bind(ctrl));

/**
 * @swagger
 * /store:
 *   put:
 *     tags: [Store]
 *     summary: Update store profile (Admin)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreProfile'
 *     responses:
 *       200:
 *         description: Store profile updated
 */
router.put('/', authenticate, authorize('ADMIN'), validate(updateStoreProfileSchema), ctrl.update.bind(ctrl));

export default router;
