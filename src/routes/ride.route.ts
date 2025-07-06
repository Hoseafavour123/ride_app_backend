import { Router } from 'express'
import { bookRideHandler, getPassengerRidesHandler, getRideStatusHandler } from '../controllers/ride.controller'

const router = Router()

// prefix: /api/v1/ride

/**
 * @swagger
 * /ride/book:
 *   post:
 *     summary: Book a new ride
 *     tags: [Ride]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pickup:
 *                 type: object
 *                 example: { coordinates: [3.4213, 6.4474] }
 *               destination:
 *                 type: object
 *                 example: { coordinates: [3.4299, 6.4602] }
 *               rideType:
 *                 type: string
 *                 example: "standard"
 *     responses:
 *       201:
 *         description: Ride request created successfully
 */
router.post('/book',  bookRideHandler)






/**
 * @swagger
 * /ride/{rideId}/status:
 *   get:
 *     summary: Get status of a ride
 *     tags: [Ride]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the ride to check
 *     responses:
 *       200:
 *         description: Ride status returned
 */
router.get(
  '/:rideId/status',
  getRideStatusHandler
)





/**
 * @swagger
 * /ride/passenger:
 *   get:
 *     summary: Get all rides for logged-in passenger
 *     tags: [Ride]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of passenger rides
 */
router.get('/passenger', getPassengerRidesHandler)


export default  router
