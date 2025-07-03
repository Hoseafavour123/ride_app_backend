import { notifyNearbyDrivers } from '../services/matching.service'
import catchErrors from '../utils/catchErrors'
import { OK } from '../constants/http'

export const notifyDriversHandler = catchErrors(async (req, res) => {
  const { rideId } = req.params

  const notifiedDrivers = await notifyNearbyDrivers(rideId)

  if (!notifiedDrivers) {
    return res.status(200).json({
      status: 'fail',
      message: 'No drivers found or ride not pending',
    })
  }

  return res.status(OK).json({
    status: 'success',
    message: 'Drivers notified',
    data: notifiedDrivers,
  })
})
