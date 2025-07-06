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
 *             properties:
 *               rideId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Driver was polite and arrived early"
 *     responses:
 *       201:
 *         description: Review submitted successfully
 */
router.post(
  '/submit',
  submitReviewHandler
)

export default router
