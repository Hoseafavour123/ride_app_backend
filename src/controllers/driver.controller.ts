import catchErrors from '../utils/catchErrors'
import { updateDriverStatusSchema } from './driverStatus.schema'
import { completeRide, startRide, updateDriverStatus } from '../services/driver.service'
import { BAD_REQUEST, OK } from '../constants/http'
import DriverStatusModel, { Availability } from '../models/driverStatus.model'
import { acceptRideOffer, rejectRideOffer } from '../services/driver.service'
import RideModel from '../models/ride.model'
import ReviewModel from '../models/review.model'



// ==================== RIDES ==========================================

export const updateDriverLocationHandler = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const payload = updateDriverStatusSchema.parse(req.body)

  const status = await updateDriverStatus({
    driverId,
    availability: payload.availability as Availability,
    location: payload.location,
  })

  return res.status(OK).json({
    status: 'success',
    data: status,
  })
})



export const acceptRideHandler = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const rideId = req.params.rideId

  const ride = await acceptRideOffer({ driverId, rideId })

  return res.status(OK).json({
    status: 'success',
    message: 'Ride accepted successfully',
    data: ride,
  })
})

export const rejectRideHandler = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const rideId = req.params.rideId

  const offer = await rejectRideOffer({ driverId, rideId })

  return res.status(OK).json({
    status: 'success',
    message: 'Ride rejected successfully',
    data: offer,
  })
})


export const startRideHandler = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const rideId = req.params.rideId

  const ride = await startRide({ driverId, rideId })

  return res.status(OK).json({
    status: 'success',
    message: 'Ride started',
    data: ride,
  })
})

export const completeRideHandler = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const rideId = req.params.rideId

  const ride = await completeRide({ driverId, rideId })

  return res.status(OK).json({
    status: 'success',
    message: 'Ride completed',
    data: ride,
  })
})




export const getDriverDashboard = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()

  const status = await DriverStatusModel.findOne({ driverId })
  const completedRides = await RideModel.find({ driverId, status: 'COMPLETED' })

  const totalEarnings = completedRides.reduce(
    (sum, ride) => sum + (ride.fareEstimate || 0),
    0
  )
  const totalTrips = completedRides.length

  const reviews = await ReviewModel.find({ revieweeId: driverId })
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null
  const totalReviews = reviews.length


  return res.status(OK).json({
    status: 'success',
    data: {
      availability: status?.availability || 'OFFLINE',
      earnings: totalEarnings,
      trips: totalTrips,
      rating: {
        average: averageRating,
        total: totalReviews,
      },
    },
  })
})

export const updateDriverAvailability = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const { availability } = req.body

  if (!['ONLINE', 'OFFLINE'].includes(availability)) {
    return res
      .status(BAD_REQUEST)
      .json({ status: 'error', message: 'Invalid availability' })
  }

  const updated = await DriverStatusModel.findOneAndUpdate(
    { driverId },
    { availability },
    { new: true, upsert: true }
  )

  return res.status(OK).json({
    status: 'success',
    message: `Availability set to ${availability}`,
    data: updated,
  })
})