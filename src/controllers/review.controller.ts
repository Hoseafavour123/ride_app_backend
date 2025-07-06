import catchErrors from '../utils/catchErrors'
import { BAD_REQUEST, CREATED } from '../constants/http'
import ReviewModel from '../models/review.model'
import RideModel from '../models/ride.model'
import appAssert from '../utils/appAssert'

export const submitReviewHandler = catchErrors(async (req, res) => {
  const reviewerId = req.user?.id
  const { rideId, rating, comment, reviewerRole } = req.body

  appAssert(rating >= 1 && rating <= 5, BAD_REQUEST, 'Rating must be 1–5')

  const ride = await RideModel.findById(rideId)
  appAssert(ride, BAD_REQUEST, 'Ride not found')
  appAssert(
    ride.status === 'COMPLETED',
    BAD_REQUEST,
    'Ride must be completed to review'
  )

  // Determine who is reviewing who
  const revieweeId =
    reviewerRole === 'PASSENGER' ? ride.driverId : ride.passengerId

  const review = await ReviewModel.create({
    rideId,
    reviewerId,
    reviewerRole,
    revieweeId,
    rating,
    comment,
  })

  return res.status(CREATED).json({
    status: 'success',
    message: 'Review submitted',
    data: review,
  })
})
