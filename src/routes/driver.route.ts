import { Router } from 'express'
import { acceptRideHandler, getDriverDashboard, rejectRideHandler, updateDriverAvailability, updateDriverLocationHandler } from '../controllers/driver.controller'
import { completeRideHandler, startRideHandler } from '../controllers/driver.controller'
import { getDriverRidesHandler } from '../controllers/ride.controller'

const driverRoutes = Router()


// prefix: /api/v1/driver

/**
 * @swagger
 * /driver/status:
 *   put:
 *     summary: Update driver's current GPS location
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [3.4213, 6.4474]
 *     responses:
 *       200:
 *         description: Driver location updated
 */
driverRoutes.put(
  '/status',
  updateDriverLocationHandler
)



/**
 * @swagger
 * /driver/ride/{rideId}/accept:
 *   post:
 *     summary: Accept a ride request
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride accepted
 */
driverRoutes.post(
  '/ride/:rideId/accept',
  acceptRideHandler
)



/**
 * @swagger
 * /driver/ride/{rideId}/reject:
 *   post:
 *     summary: Reject a ride request
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride rejected
 */
driverRoutes.post(
  '/ride/:rideId/reject',
  rejectRideHandler
)





/**
 * @swagger
 * /driver/ride/{rideId}/start:
 *   put:
 *     summary: Start a ride
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride started
 */
driverRoutes.put('/ride/:rideId/start', startRideHandler)




/**
 * @swagger
 * /driver/ride/{rideId}/complete:
 *   put:
 *     summary: Complete a ride
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride completed
 */
driverRoutes.put('/ride/:rideId/complete', completeRideHandler)





/**
 * @swagger
 * /driver/rides:
 *   get:
 *     summary: Get driver’s ride history
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed and active rides
 */

driverRoutes.get('/rides', getDriverRidesHandler)




/**
 * @swagger
 * /driver/dashboard:
 *   get:
 *     summary: Get driver dashboard (earnings, rating)
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard info returned
 */
driverRoutes.get('/dashboard', getDriverDashboard)




/**
 * @swagger
 * /driver/availability:
 *   put:
 *     summary: Update driver availability (ONLINE/OFFLINE)
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability:
 *                 type: string
 *                 enum: [ONLINE, OFFLINE]
 *                 example: "ONLINE"
 *     responses:
 *       200:
 *         description: Availability updated
 */
driverRoutes.put('/availability',  updateDriverAvailability)

export default driverRoutes