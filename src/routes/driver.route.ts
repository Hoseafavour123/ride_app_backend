import { Router } from 'express'
import { acceptRideHandler, rejectRideHandler, updateDriverLocationHandler } from '../controllers/driver.controller'
import { completeRideHandler, startRideHandler } from '../controllers/driver.controller'
import { getDriverRidesHandler } from '../controllers/ride.controller'

const driverRoutes = Router()


// prefix: /api/v1/driver
driverRoutes.put(
  '/status',
  updateDriverLocationHandler
)

driverRoutes.post(
  '/ride/:rideId/accept',
  acceptRideHandler
)

driverRoutes.post(
  '/ride/:rideId/reject',
  rejectRideHandler
)

driverRoutes.put('/ride/:rideId/start', startRideHandler)

driverRoutes.put('/ride/:rideId/complete', completeRideHandler)

driverRoutes.get('/rides', getDriverRidesHandler)

export default driverRoutes
