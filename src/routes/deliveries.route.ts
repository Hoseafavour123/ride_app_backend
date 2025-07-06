import { Router } from 'express'
import { acceptDeliveryHandler, bookDeliveryHandler, completeDeliveryHandler, getDeliveryStatusHandler, notifyDriversForDeliveryHandler, pickupDeliveryHandler, rejectDeliveryHandler } from '../controllers/delivery.controller'

const deliveryRoutes = Router()


// prefix: /api/v1/delivery


deliveryRoutes.post('/', bookDeliveryHandler)

deliveryRoutes.post(
  '/:deliveryId/notify',
  notifyDriversForDeliveryHandler
)

deliveryRoutes.post(
  '/:deliveryId/accept',
  acceptDeliveryHandler
)

deliveryRoutes.post(
  '/:deliveryId/reject',
  rejectDeliveryHandler
)

deliveryRoutes.put(
  '/:deliveryId/pickup',
  pickupDeliveryHandler
)

deliveryRoutes.put(
  '/:deliveryId/complete',
  completeDeliveryHandler
)

deliveryRoutes.get(
  '/:deliveryId/status',
  getDeliveryStatusHandler
)

export default deliveryRoutes
