import { estimateFare } from '../utils/fare_estimate'
import catchErrors from '../utils/catchErrors'
import { OK } from '../constants/http'

export const estimateFareHandler = catchErrors(async (req, res) => {
  const { pickup, dropoff, type, category } = req.body

  const result = estimateFare({ pickup, dropoff, type, category })

  return res.status(OK).json({
    status: 'success',
    message: 'Fare estimated successfully',
    data: result,
  })
})
