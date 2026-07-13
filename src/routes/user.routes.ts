/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  updateProfileSchema,
  changePasswordSchema,
  adminUpdateUserSchema,
  userIdSchema,
} from '../validators/user.validator';

const router = Router();
const ctrl = new UserController();

// Private user routes
/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get own profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, ctrl.getProfile.bind(ctrl));

/**
 * @swagger
 * /users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update own profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', authenticate, validate(updateProfileSchema), ctrl.updateProfile.bind(ctrl));

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     tags: [Users]
 *     summary: Change own password
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Current password incorrect
 */
router.put('/change-password', authenticate, validate(changePasswordSchema), ctrl.changePassword.bind(ctrl));

// Admin routes
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: keyword
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [ADMIN, USER] }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Paginated users
 */
router.get('/', authenticate, authorize('ADMIN'), ctrl.getAllUsers.bind(ctrl));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID (Admin)
 *     security:
 *       - BearerAuth: []
 */
router.get('/:id', authenticate, authorize('ADMIN'), validate(userIdSchema), ctrl.getUserById.bind(ctrl));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user (Admin)
 *     security:
 *       - BearerAuth: []
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(adminUpdateUserSchema), ctrl.adminUpdateUser.bind(ctrl));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user (Admin, soft delete)
 *     security:
 *       - BearerAuth: []
 */
router.delete('/:id', authenticate, authorize('ADMIN'), validate(userIdSchema), ctrl.deleteUser.bind(ctrl));

export default router;
