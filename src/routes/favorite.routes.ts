/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: User favorites management
 */
import { Router } from 'express';
import { FavoriteController } from '../controllers/favorite.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const ctrl = new FavoriteController();

/**
 * @swagger
 * /favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Get my favorite products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated favorites list
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, ctrl.getMyFavorites.bind(ctrl));

/**
 * @swagger
 * /favorites/{productId}:
 *   post:
 *     tags: [Favorites]
 *     summary: Toggle favorite (add/remove)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Favorite toggled
 *       404:
 *         description: Product not found
 */
router.post('/:productId', authenticate, ctrl.toggleFavorite.bind(ctrl));

/**
 * @swagger
 * /favorites/{productId}/check:
 *   get:
 *     tags: [Favorites]
 *     summary: Check if product is favorited
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Favorite status
 */
router.get('/:productId/check', authenticate, ctrl.checkFavorite.bind(ctrl));

export default router;
