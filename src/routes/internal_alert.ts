import { Router } from 'express'
import catchErrors from '../utils/catchErrors'
import { OK, BAD_REQUEST } from '../constants/http'

const internalRoutes = Router()

internalRoutes.post(
  '/emergency-alerts',
  catchErrors(async (req, res) => {
    const payload = req.body

    if (payload?.type !== 'SOS_ALERT') {
      return res.status(BAD_REQUEST).json({
        status: 'error',
        message: 'Unsupported webhook type',
      })
    }

    // Simulate internal processing (e.g. logging)
    console.log(
      '🚨 Incoming SOS Webhook Alert:',
      JSON.stringify(payload, null, 2)
    )

    return res.status(OK).json({
      status: 'received',
      message: 'SOS alert logged successfully',
    })
  })
)

export default internalRoutes
