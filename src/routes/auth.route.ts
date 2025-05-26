import { Router } from 'express'
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  googleAuthHandler,
  facebookAuthHandler,
  requestPhoneCodeHandler,
  verifyPhoneCodeHandler,
} from '../controllers/auth.controller'
import { authenticate } from '../middleware/authenticate'
import Audience from '../constants/audience'

const authRoutes = Router()

// prefix: /api/v1/auth

/**
 * @swagger
 * /auth/request-phone-verification:
 *   post:
 *     summary: Request phone verification code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+2348100000000"
 *     responses:
 *       200:
 *         description: OTP sent
 */
authRoutes.post('/request-phone-verification', requestPhoneCodeHandler)

/**
 * @swagger
 * /auth/phone/verify:
 *   post:
 *     summary: Verify phone OTP code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, code]
 *             properties:
 *               phone:
 *                 type: string
 *               code:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Phone verified
 */
authRoutes.post('/phone/verify', verifyPhoneCodeHandler)

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login or register via Google Sign-In
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [DRIVER, PASSENGER]
 *               useCookies:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Google login/register successful
 */
authRoutes.post('/google', googleAuthHandler)

/**
 * @swagger
 * /auth/facebook:
 *   post:
 *     summary: Login or register via Facebook Sign-In
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accessToken]
 *             properties:
 *               accessToken:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [DRIVER, PASSENGER]
 *               useCookies:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Facebook login/register successful
 */
authRoutes.post('/facebook', facebookAuthHandler)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, phone, email, password, confirmPassword, role]
 *             properties:
 *
  *              fullName:
  *               type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *              confirmPassword:
 *                type: string
 *               role:
 *                 type: string
 *                 enum: [admin, driver, passenger]
 *               useCookies:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User registered
 */
authRoutes.post('/register', registerHandler)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email or phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emailOrPhone, password]
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *               useCookies:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Login successful
 */
authRoutes.post('/login', loginHandler)

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *               useCookies:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Token refreshed
 */
authRoutes.post('/refresh', refreshHandler)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
authRoutes.post('/logout', authenticate(Audience.User), logoutHandler)

export default authRoutes
