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
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: "Lagos Terminal"
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [3.465, 6.428]
 *               dropoff:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: "Lekki Phase"
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [3.4299, 6.4602]
 *               rideType:
 *                 type: string
 *                 example: "standard"
 *               fareEstimate:
 *                 type: number
 *                 example: 1500
 *             required:
 *               - pickup
 *               - dropoff
 *               - rideType
 *               - fareEstimate
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
