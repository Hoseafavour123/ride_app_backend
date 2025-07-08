import { Router } from 'express'
import { triggerSOSHandler } from '../controllers/sos.controller'

const sosRoutes = Router()




/**
 * @swagger
 * /sos/trigger:
 *   post:
 *     summary: Trigger an SOS alert (emergency)
 *     tags: [SOS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - role
 *             properties:
 *               rideId:
 *                 type: string
 *                 example: "64e5a4c8f2d45a2a8c1e4b22"
 *               deliveryId:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               location:
 *                 type: object
 *                 required:
 *                   - type
 *                   - coordinates
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Point]
 *                     example: "Point"
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     minItems: 2
 *                     maxItems: 2
 *                     example: [3.4213, 6.4474]
 *                   address:
 *                     type: string
 *                     example: "15 Broad Street, Lagos"
 *               note:
 *                 type: string
 *                 example: "Passenger became violent"
 *               role:
 *                 type: string
 *                 enum: [DRIVER, PASSENGER, DISPATCHER]
 *                 example: "DRIVER"
 *     responses:
 *       200:
 *         description: SOS alert successfully sent
 */
sosRoutes.post('/trigger', triggerSOSHandler)

export default sosRoutes

