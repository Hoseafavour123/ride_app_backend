import DriverStatusModel, { Availability } from '../models/driverStatus.model'
import { CONFLICT, FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from '../constants/http'
import RideModel, { RideStatus } from '../models/ride.model'
import RideOfferModel, { RideOfferStatus } from '../models/rideOffer.model'
import appAssert from '../utils/appAssert'
import DeliveryModel, { DeliveryStatus } from '../models/delivery.model'

// ==================== RIDES ===================================


export const updateDriverStatus = async ({
  driverId,
  availability,
  location,
}: {
  driverId: string | undefined
  availability: Availability
  location: { coordinates: [number, number] }
}) => {
  const status = await DriverStatusModel.findOneAndUpdate(
    { driverId },
    {
      availability,
      location: {
        type: 'Point',
        coordinates: location.coordinates,
      },
    },
    { upsert: true, new: true }
  )
  return status
}



export const acceptRideOffer = async ({
  driverId,
  rideId,
}: {
  driverId: string | undefined
  rideId: string
}) => {
  const ride = await RideModel.findById(rideId)
  appAssert(ride, NOT_FOUND, 'Ride not found')

  // Ensure ride is still unassigned
  appAssert(
    ride.status === RideStatus.PENDING,
    CONFLICT,
    'Ride has already been assigned'
  )

  const offer = await RideOfferModel.findOne({ rideId, driverId })
  appAssert(offer, FORBIDDEN, 'You were not offered this ride')
  appAssert(
    offer.status === RideOfferStatus.SENT,
    FORBIDDEN,
    'You already responded to this ride'
  )

  // Atomically assign driver
  const updatedRide = await RideModel.findOneAndUpdate(
    { _id: rideId, status: RideStatus.PENDING },
    {
      driverId,
      status: RideStatus.ACCEPTED,
    },
    { new: true }
  )

  if (!updatedRide) {
    throw new Error('Ride was already taken')
  }

  // Update driver's status
  await DriverStatusModel.updateOne(
    { driverId },
    { availability: Availability.OFFLINE }
  )

  // Mark this offer as accepted
  offer.status = RideOfferStatus.ACCEPTED
  await offer.save()

  // Expire all other offers
  await RideOfferModel.updateMany(
    { rideId, driverId: { $ne: driverId } },
    { status: RideOfferStatus.EXPIRED }
  )

  // TODO: Notify passenger + other drivers

  return updatedRide
}


export const rejectRideOffer = async ({
  driverId,
  rideId,
}: {
  driverId: string | undefined
  rideId: string
}) => {
  const offer = await RideOfferModel.findOne({ rideId, driverId })
  appAssert(offer, FORBIDDEN, 'You were not offered this ride')

  if (offer.status !== RideOfferStatus.SENT) return offer

  offer.status = RideOfferStatus.REJECTED
  await offer.save()

  // Future: track rejection count here for analytics

  return offer
}



export const startRide = async ({
  rideId,
  driverId,
}: {
  rideId: string
  driverId: string | undefined
}) => {
  const ride = await RideModel.findById(rideId)
  appAssert(ride, NOT_FOUND, 'Ride not found')

  appAssert(
    ride.driverId?.toString() === driverId,
    UNAUTHORIZED,
    'You are not assigned to this ride'
  )

  appAssert(
    ride.status === RideStatus.ACCEPTED,
    CONFLICT,
    'Ride cannot be started at this stage'
  )

  ride.status = RideStatus.IN_PROGRESS
  ride.startedAt = new Date()
  await ride.save()

  return ride
}

export const completeRide = async ({
  rideId,
  driverId,
}: {
  rideId: string
  driverId: string | undefined
}) => {
  const ride = await RideModel.findById(rideId)
  appAssert(ride, NOT_FOUND, 'Ride not found')

  appAssert(
    ride.driverId?.toString() === driverId,
    UNAUTHORIZED,
    'You are not assigned to this ride'
  )

  appAssert(
    ride.status === RideStatus.IN_PROGRESS,
    CONFLICT,
    'Ride is not in progress'
  )

  ride.status = RideStatus.COMPLETED
  ride.completedAt = new Date()
  await ride.save()

  // TODO: Stub fare calculation
  return ride
}