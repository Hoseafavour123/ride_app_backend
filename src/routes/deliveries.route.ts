import { Router } from 'express'
import { acceptDeliveryHandler, bookDeliveryHandler, completeDeliveryHandler, getDeliveryStatusHandler, notifyDriversForDeliveryHandler, pickupDeliveryHandler, rejectDeliveryHandler } from '../controllers/delivery.controller'

const deliveryRoutes = Router()


// prefix: /api/v1/delivery

/**
 * @swagger
 * /delivery:
 *   post:
 *     summary: Book a new delivery
 *     tags: [Delivery]
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
 *               packageType:
 *                 type: string
 *                 example: "small_box"
 *     responses:
 *       201:
 *         description: Delivery request created
 */
deliveryRoutes.post('/', bookDeliveryHandler)



/**
 * @swagger
 * /delivery/{deliveryId}/notify:
 *   post:
 *     summary: Notify nearby drivers of a delivery
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drivers notified
 */
deliveryRoutes.post(
  '/:deliveryId/notify',
  notifyDriversForDeliveryHandler
)



/**
 * @swagger
 * /delivery/{deliveryId}/accept:
 *   post:
 *     summary: Driver accepts a delivery
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery accepted
 */
deliveryRoutes.post(
  '/:deliveryId/accept',
  acceptDeliveryHandler
)




/**
 * @swagger
 * /delivery/{deliveryId}/reject:
 *   post:
 *     summary: Driver rejects a delivery
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery rejected
 */
deliveryRoutes.post(
  '/:deliveryId/reject',
  rejectDeliveryHandler
)



/**
 * @swagger
 * /delivery/{deliveryId}/pickup:
 *   put:
 *     summary: Mark delivery as picked up
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pickup confirmed
 */
deliveryRoutes.put(
  '/:deliveryId/pickup',
  pickupDeliveryHandler
)



/**
 * @swagger
 * /delivery/{deliveryId}/complete:
 *   put:
 *     summary: Mark delivery as completed
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery completed
 */
deliveryRoutes.put(
  '/:deliveryId/complete',
  completeDeliveryHandler
)





/**
 * @swagger
 * /delivery/{deliveryId}/status:
 *   get:
 *     summary: Track delivery status
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deliveryId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery status returned
 */
deliveryRoutes.get(
  '/:deliveryId/status',
  getDeliveryStatusHandler
)

export default deliveryRoutes
