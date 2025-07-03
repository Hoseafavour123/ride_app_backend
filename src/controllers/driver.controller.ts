import catchErrors from '../utils/catchErrors'
import { updateDriverStatusSchema } from './driverStatus.schema'
import { completeRide, startRide, updateDriverStatus } from '../services/driver.service'
import { OK } from '../constants/http'
import { Availability } from '../models/driverStatus.model'
import { acceptRideOffer, rejectRideOffer } from '../services/driver.service'

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