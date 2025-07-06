import appAssert from '../utils/appAssert'
import catchErrors from '../utils/catchErrors'
import { sendEmergencyWebhook } from '../utils/sosAlert'
import SOSModel from '../models/sos.model'
import { BAD_REQUEST, OK } from '../constants/http'

export const triggerSOSHandler = catchErrors(async (req, res) => {
  const userId = req.user?.id
  const { location, rideId, deliveryId, note, role } = req.body

  appAssert(
    location?.coordinates?.length === 2,
    BAD_REQUEST,
    'Invalid location'
  )

  const sos = await SOSModel.create({
    userId,
    role,
    location,
    rideId,
    deliveryId,
    note,
    status: 'TRIGGERED',
  })

  //  Send webhook to emergency team
  await sendEmergencyWebhook(sos)

  return res.status(OK).json({
    status: 'success',
    message: 'SOS triggered. Help is on the way.',
    data: sos,
  })
})
