/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin dashboard and statistics
 */
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const ctrl = new DashboardController();

/**
 * @swagger
 * /dashboard/statistics:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics (Admin)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                         admins: { type: integer }
 *                         customers: { type: integer }
 *                     products:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                         active: { type: integer }
 *                         inactive: { type: integer }
 *                         outOfStock: { type: integer }
 *                     categories:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                     banners:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/statistics', authenticate, authorize('ADMIN'), ctrl.getStatistics.bind(ctrl));

export default router;
