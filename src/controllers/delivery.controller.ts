import catchErrors from '../utils/catchErrors'
import DeliveryModel from '../models/delivery.model'
import { OK, CREATED } from '../constants/http'
import { getDeliveryStatus, notifyNearbyDriversForDelivery, updateDeliveryStatus } from '../services/delivery.service'
import { acceptDeliveryOffer, rejectDeliveryOffer } from '../services/delivery.service'

export const bookDeliveryHandler = catchErrors(async (req, res) => {
  const userId = req.user?.id.toString()
  const { pickup, dropoff, packageType, receiverName, receiverPhone } = req.body

  const delivery = await DeliveryModel.create({
    userId,
    pickup,
    dropoff,
    packageType,
    receiverName,
    receiverPhone,
  })

  return res.status(CREATED).json({
    status: 'success',
    message: 'Delivery booked successfully',
    data: delivery,
  })
})

export const notifyDriversForDeliveryHandler = catchErrors(async (req, res) => {
  const deliveryId = req.params.deliveryId
  const drivers = await notifyNearbyDriversForDelivery(deliveryId)

  return res.status(OK).json({
    status: 'success',
    message: 'Drivers notified for delivery',
    data: drivers,
  })
})


export const acceptDeliveryHandler = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const deliveryId = req.params.deliveryId

  const delivery = await acceptDeliveryOffer({ deliveryId, driverId })

  return res.status(OK).json({
    status: 'success',
    message: 'Delivery accepted',
    data: delivery,
  })
})

export const rejectDeliveryHandler = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const deliveryId = req.params.deliveryId

  const result = await rejectDeliveryOffer({ deliveryId, driverId })

  return res.status(OK).json({
    status: 'success',
    message: 'Delivery rejected',
    data: result,
  })
})

export const pickupDeliveryHandler = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const deliveryId = req.params.deliveryId

  const delivery = await updateDeliveryStatus({
    deliveryId,
    driverId,
    action: 'pickup',
  })

  return res.status(OK).json({
    status: 'success',
    message: 'Package picked up',
    data: delivery,
  })
})

export const completeDeliveryHandler = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const deliveryId = req.params.deliveryId

  const delivery = await updateDeliveryStatus({
    deliveryId,
    driverId,
    action: 'deliver',
  })

  return res.status(OK).json({
    status: 'success',
    message: 'Package delivered',
    data: delivery,
  })
})


export const getDeliveryStatusHandler = catchErrors(async (req, res) => {
  const deliveryId = req.params.deliveryId

  const result = await getDeliveryStatus(deliveryId)

  return res.status(OK).json({
    status: 'success',
    data: result,
  })
})