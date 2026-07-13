/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and search
 */
import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/auth.middleware';
import { uploadProductImage } from '../middlewares/upload.middleware';
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from '../validators/product.validator';

const router = Router();
const ctrl = new ProductController();

// Public routes with optional auth (to detect favorites)
/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products with filters and pagination
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
 *         description: Search in name and description
 *       - in: query
 *         name: categoryId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, INACTIVE, OUT_OF_STOCK] }
 *       - in: query
 *         name: isFeatured
 *         schema: { type: boolean }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [newest, oldest, price_asc, price_desc, alphabetical] }
 *     responses:
 *       200:
 *         description: List of products with pagination
 */
router.get('/', optionalAuthenticate, ctrl.getAll.bind(ctrl));

/**
 * @swagger
 * /products/featured:
 *   get:
 *     tags: [Products]
 *     summary: Get featured products
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 8 }
 *     responses:
 *       200:
 *         description: Featured products list
 */
router.get('/featured', ctrl.getFeatured.bind(ctrl));

/**
 * @swagger
 * /products/newest:
 *   get:
 *     tags: [Products]
 *     summary: Get newest products
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 8 }
 *     responses:
 *       200:
 *         description: Newest products list
 */
router.get('/newest', ctrl.getNewest.bind(ctrl));

/**
 * @swagger
 * /products/slug/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Not found
 */
router.get('/slug/:slug', optionalAuthenticate, ctrl.getBySlug.bind(ctrl));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Not found
 */
router.get('/:id', optionalAuthenticate, validate(productIdSchema), ctrl.getById.bind(ctrl));

// Admin only routes
/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create new product (Admin)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, stock, categoryId]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               weight: { type: number }
 *               categoryId: { type: string, format: uuid }
 *               status: { type: string, enum: [ACTIVE, INACTIVE, OUT_OF_STOCK] }
 *               isFeatured: { type: boolean }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', authenticate, authorize('ADMIN'), uploadProductImage, ctrl.create.bind(ctrl));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product (Admin)
 *     security:
 *       - BearerAuth: []
 */
router.put('/:id', authenticate, authorize('ADMIN'), uploadProductImage, validate(updateProductSchema), ctrl.update.bind(ctrl));

/**
 * @swagger
 * /products/{id}/image:
 *   post:
 *     tags: [Products]
 *     summary: Upload product image (Admin)
 *     security:
 *       - BearerAuth: []
 */
router.post('/:id/image', authenticate, authorize('ADMIN'), uploadProductImage, ctrl.uploadImage.bind(ctrl));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product (Admin, soft delete)
 *     security:
 *       - BearerAuth: []
 */
router.delete('/:id', authenticate, authorize('ADMIN'), validate(productIdSchema), ctrl.delete.bind(ctrl));

export default router;
