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
 *             properties:
 *               rideId:
 *                 type: string
 *               deliveryId:
 *                 type: string
 *                 nullable: true
 *               location:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [3.4213, 6.4474]
 *               note:
 *                 type: string
 *                 example: "Passenger became violent"
 *     responses:
 *       200:
 *         description: SOS alert successfully sent
 */
sosRoutes.post('/trigger', triggerSOSHandler)

export default sosRoutes