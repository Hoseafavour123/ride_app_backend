import { CONFLICT, FORBIDDEN, NOT_FOUND } from '../constants/http'
import DeliveryModel, { DeliveryStatus } from '../models/delivery.model'
import DriverStatusModel, { Availability } from '../models/driverStatus.model'
import RideOfferModel, { RideOfferStatus } from '../models/rideOffer.model'
import UserModel from '../models/user.model'
import appAssert from '../utils/appAssert'
import { notifyDriver } from '../utils/notifyDriver'

const MAX_DISTANCE_METERS = 5000
const MAX_OFFERS = 5


export const notifyNearbyDriversForDelivery = async (deliveryId: string) => {
  const delivery = await DeliveryModel.findById(deliveryId)
  if (!delivery || delivery.status !== DeliveryStatus.PENDING) return null

  const [lng, lat] = delivery.pickup.coordinates

  const nearbyDrivers = await DriverStatusModel.find({
    availability: Availability.ONLINE,
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: MAX_DISTANCE_METERS,
      },
    },
  }).limit(MAX_OFFERS).select('driverId availability location')

  for (const driver of nearbyDrivers) {
    await RideOfferModel.updateOne(
      { deliveryId, driverId: driver.driverId },
      { deliveryId, driverId: driver.driverId },
      { upsert: true }
    )

    await notifyDriver(driver.driverId.toString(), delivery)
  }

  return nearbyDrivers
}



export const updateDeliveryStatus = async ({
  deliveryId,
  driverId,
  action,
}: {
  deliveryId: string
  driverId: string | undefined
  action: 'pickup' | 'deliver'
}) => {
  const delivery = await DeliveryModel.findById(deliveryId)
  appAssert(delivery, NOT_FOUND, 'Delivery not found')

  appAssert(
    delivery.driverId?.toString() === driverId,
    FORBIDDEN,
    'You are not assigned to this delivery'
  )

  if (action === 'pickup') {
    appAssert(
      delivery.status === DeliveryStatus.ACCEPTED,
      CONFLICT,
      'Cannot pick up yet'
    )
    delivery.status = DeliveryStatus.PICKED_UP
    delivery.pickedUpAt = new Date()
  } else if (action === 'deliver') {
    appAssert(
      delivery.status === DeliveryStatus.PICKED_UP,
      CONFLICT,
      'Cannot complete delivery yet'
    )
    delivery.status = DeliveryStatus.DELIVERED
    delivery.deliveredAt = new Date()
  }

  await delivery.save()
  return delivery
}

export const acceptDeliveryOffer = async ({
  deliveryId,
  driverId,
}: {
  deliveryId: string
  driverId: string | undefined
}) => {
  const delivery = await DeliveryModel.findById(deliveryId)
  appAssert(delivery, NOT_FOUND, 'Delivery not found')
  appAssert(
    delivery.status === DeliveryStatus.PENDING,
    CONFLICT,
    'Delivery already accepted'
  )

  const offer = await RideOfferModel.findOne({ deliveryId, driverId })
  appAssert(offer, FORBIDDEN, 'You were not offered this delivery')

  const updated = await DeliveryModel.findOneAndUpdate(
    { _id: deliveryId, status: DeliveryStatus.PENDING },
    { driverId, status: DeliveryStatus.ACCEPTED },
    { new: true }
  )
  appAssert(updated, CONFLICT, 'Another driver already accepted')

  offer.status = RideOfferStatus.ACCEPTED
  await offer.save()

  await RideOfferModel.updateMany(
    { deliveryId, driverId: { $ne: driverId } },
    { status: RideOfferStatus.EXPIRED }
  )

  return updated
}

export const rejectDeliveryOffer = async ({
  deliveryId,
  driverId,
}: {
  deliveryId: string
  driverId: string | undefined
}) => {
  const offer = await RideOfferModel.findOne({ deliveryId, driverId })
  appAssert(offer, FORBIDDEN, 'You were not offered this delivery')

  if (offer.status === RideOfferStatus.SENT) {
    offer.status = RideOfferStatus.REJECTED
    await offer.save()
  }

  return offer
}


export const getDeliveryStatus = async (deliveryId: string) => {
  const delivery = await DeliveryModel.findById(deliveryId)
  appAssert(delivery, NOT_FOUND, 'Delivery not found')

  if (!delivery.driverId) {
    return {
      status: delivery.status,
      message: 'Looking for a driver...',
    }
  }

  const driver = await UserModel.findById(delivery.driverId)
  const driverStatus = await DriverStatusModel.findOne({
    driverId: delivery.driverId,
  })

  return {
    status: delivery.status,
    driver: {
      fullName: driver?.fullName || '',
      phone: driver?.phone || '',
      vehicle: driver?.vehicle || '',
      rating: driver?.rating || null,
    },
    location: driverStatus?.location || null,
  }
}
  