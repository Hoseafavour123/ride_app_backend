import { NOT_FOUND } from '../constants/http'
import DriverStatusModel from '../models/driverStatus.model'
import RideModel, { RideStatus } from '../models/ride.model'
import UserModel from '../models/user.model'
import appAssert from '../utils/appAssert'

export const createRideBooking = async ({
  passengerId,
  driverId,
  pickup,
  dropoff,
  fareEstimate,
}:{
  passengerId: string | undefined
  driverId:string
  pickup: { address: string; coordinates: [number, number] }
  dropoff: { address: string; coordinates: [number, number] }
  fareEstimate: number
}) => {
  const ride = await RideModel.create({
    passengerId,
    driverId,
    pickup,
    dropoff,
    fareEstimate,
    status: RideStatus.PENDING,
  })

  return ride
}


export const getRideStatus = async (rideId: string) => {
  const ride = await RideModel.findById(rideId)
  appAssert(ride, NOT_FOUND, 'Ride not found')

  if (!ride.driverId) {
    return {
      status: ride.status,
      message: 'Looking for a driver...',
    }
  }

  const driver = await UserModel.findById(ride.driverId)
  const driverStatus = await DriverStatusModel.findOne({
    driverId: ride.driverId,
  })

  return {
    status: ride.status,
    driver: {
      fullName: driver?.fullName || '',
      phone: driver?.phone || '',
      vehicle: driver?.vehicle || '',
      rating: driver?.rating || null,
    },
    location: driverStatus?.location || null,
  }
}


export const getPassengerRides = async (userId: string | undefined) => {
  return RideModel.find({ passengerId: userId }).sort({ createdAt: -1 }).limit(20)
}

export const getDriverRides = async (driverId: string | undefined) => {
  return RideModel.find({ driverId }).sort({ createdAt: -1 }).limit(20)
}