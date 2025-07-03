import RideModel, { RideStatus } from '../models/ride.model'
import DriverStatusModel, { Availability } from '../models/driverStatus.model'
import RideOfferModel from '../models/rideOffer.model'
import { notifyDriver } from '../utils/notifyDriver'

const MAX_DISTANCE_METERS = 5000
const MAX_OFFERS = 5

export const notifyNearbyDrivers = async (rideId: string) => {
  const ride = await RideModel.findById(rideId)
  if (!ride || ride.status !== RideStatus.PENDING) return null

  const [lng, lat] = ride.pickup.coordinates

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

  if (!nearbyDrivers.length) return null

  for (const driver of nearbyDrivers) {
    await RideOfferModel.updateOne(
      { rideId, driverId: driver.driverId },
      { rideId, driverId: driver.driverId },
      { upsert: true }
    )
    await notifyDriver(driver.driverId.toString(), ride)
  }

  return nearbyDrivers

}
