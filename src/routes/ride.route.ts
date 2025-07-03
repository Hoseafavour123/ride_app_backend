import { Router } from 'express'
import { bookRideHandler, getPassengerRidesHandler, getRideStatusHandler } from '../controllers/ride.controller'

const router = Router()

// prefix: /api/v1/ride
router.post('/book',  bookRideHandler)

router.get(
  '/:rideId/status',
  getRideStatusHandler
)

router.get('/passenger', getPassengerRidesHandler)


export default router
