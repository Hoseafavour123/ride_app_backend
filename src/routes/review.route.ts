import { Router } from 'express'
import { submitReviewHandler } from '../controllers/review.controller'

const router = Router()


/**
 * @swagger
 * /reviews/submit:
 *   post:
 *     summary: Submit a rating and review for a ride
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rideId
 *               - rating
 *               - reviewerRole
 *             properties:
 *               rideId:
 *                 type: string
 *                 example: "64e5a4c8f2d45a2a8c1e4b22"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Driver was polite and arrived early"
 *               reviewerRole:
 *                 type: string
 *                 enum: [PASSENGER, DRIVER]
 *                 example: "PASSENGER"
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Review submitted
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f2c5d2f0d4e8123e7c1234"
 *                     rideId:
 *                       type: string
 *                       example: "64e5a4c8f2d45a2a8c1e4b22"
 *                     reviewerId:
 *                       type: string
 *                       example: "64f2b3d4a6d8e720ef123abc"
 *                     reviewerRole:
 *                       type: string
 *                       example: "PASSENGER"
 *                     revieweeId:
 *                       type: string
 *                       example: "64f2b3d4a6d8e720ef123def"
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: "Driver was polite and arrived early"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-08T12:34:56.789Z"
 *       400:
 *         description: Bad request (e.g., invalid rating, ride not found, or ride not completed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Rating must be 1–5
 */
router.post(
  '/submit',
  submitReviewHandler
)

export default router
