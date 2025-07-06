import { Router } from 'express';
import { notifyDriversHandler } from '../controllers/matching.controller';

const router = Router();

// prefix: /api/v1/matching

/**
 * @swagger
 * /matching/notify-drivers/{rideId}:
 *   post:
 *     summary: Notify available nearby drivers of a ride request
 *     tags: [Matching]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ride to be matched with drivers
 *     responses:
 *       200:
 *         description: Ride matching initiated and drivers notified
 */
router.post(
  '/notify-drivers/:rideId',
  notifyDriversHandler
);

export default router;