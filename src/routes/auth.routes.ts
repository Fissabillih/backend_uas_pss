/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';
import { GoogleAuthController } from '../controllers/googleAuth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator';
import '../config/passport'; // initialize passport strategies

const router = Router();
const ctrl = new AuthController();
const googleCtrl = new GoogleAuthController();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Budi Santoso" }
 *               email: { type: string, format: email, example: "budi@example.com" }
 *               password: { type: string, example: "Password123" }
 *               phone: { type: string, example: "+6281234567890" }
 *               address: { type: string, example: "Jl. Ahmad Yani No. 45, Pemalang" }
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       409:
 *         description: Email already registered
 *       422:
 *         description: Validation error
 */
router.post('/register', authRateLimiter, validate(registerSchema), ctrl.register.bind(ctrl));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: "admin@tbmulyaabadi.com" }
 *               password: { type: string, example: "Admin123!" }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authRateLimiter, validate(loginSchema), ctrl.login.bind(ctrl));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and revoke refresh token
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authenticate, ctrl.logout.bind(ctrl));

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh-token', validate(refreshTokenSchema), ctrl.refreshToken.bind(ctrl));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, ctrl.me.bind(ctrl));

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Login / Register dengan Google OAuth
 *     description: Redirect ke halaman login Google. Setelah autentikasi berhasil, user akan diarahkan ke frontend dengan token JWT.
 *     responses:
 *       302:
 *         description: Redirect ke Google OAuth
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Google OAuth callback (dipakai oleh Google, bukan client)
 *     responses:
 *       302:
 *         description: Redirect ke frontend dengan token JWT
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
  }),
  googleCtrl.callback.bind(googleCtrl),
);

export default router;
