/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Product categories management
 */
import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from '../validators/category.validator';

const router = Router();
const ctrl = new CategoryController();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories (public)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: keyword
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of categories with pagination
 */
router.get('/', ctrl.getAll.bind(ctrl));

/**
 * @swagger
 * /categories/slug/{slug}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by slug (public)
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get('/slug/:slug', ctrl.getBySlug.bind(ctrl));

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Not found
 */
router.get('/:id', validate(categoryIdSchema), ctrl.getById.bind(ctrl));

// Admin only
/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create new category (Admin)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Semen" }
 *               description: { type: string }
 *               isActive: { type: boolean, default: true }
 *               sortOrder: { type: integer, default: 0 }
 *     responses:
 *       201:
 *         description: Category created
 *       409:
 *         description: Name already exists
 */
router.post('/', authenticate, authorize('ADMIN'), validate(createCategorySchema), ctrl.create.bind(ctrl));

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update category (Admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Not found
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateCategorySchema), ctrl.update.bind(ctrl));

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category (Admin, soft delete)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), validate(categoryIdSchema), ctrl.delete.bind(ctrl));

export default router;
