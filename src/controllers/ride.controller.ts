import catchErrors from '../utils/catchErrors'
import { bookRideSchema } from './ride.schema'
import { createRideBooking, getDriverRides, getPassengerRides, getRideStatus } from '../services/ride.service'
import { CREATED, OK } from '../constants/http'

export const bookRideHandler = catchErrors(async (req, res) => {
  const passengerId = req.user?.id.toString()
  const { driverId } = req.params 
  const rideInput = bookRideSchema.parse(req.body)

  const ride = await createRideBooking({
    passengerId,
    driverId,
    ...rideInput,
  })

  return res.status(CREATED).json({
    status: 'success',
    data: ride,
  })
})

export const getRideStatusHandler = catchErrors(async (req, res) => {
  const { rideId } = req.params

  const result = await getRideStatus(rideId)

  return res.status(OK).json({
    status: 'success',
    data: result,
  })
})

export const getPassengerRidesHandler = catchErrors(async (req, res) => {
  const userId = req.user?.id.toString()
  const rides = await getPassengerRides(userId)

  return res.status(OK).json({
    status: 'success',
    data: rides,
  })
})

export const getDriverRidesHandler = catchErrors(async (req, res) => {
  const driverId = req.user?.id.toString()
  const rides = await getDriverRides(driverId)

  return res.status(OK).json({
    status: 'success',
    data: rides,
  })
})

