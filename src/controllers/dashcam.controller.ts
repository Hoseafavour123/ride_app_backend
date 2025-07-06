import cloudinary from '../config/cloudinary'
import DashcamClipModel, { ClipStatus } from '../models/dashcamClip.model'
import catchErrors from '../utils/catchErrors'
import { OK, BAD_REQUEST } from '../constants/http'
import appAssert from '../utils/appAssert'

export const initiateDashcamUpload = catchErrors(async (req, res) => {
  const driverId = req.user?.id
  const { rideId, deliveryId, note } = req.body

  appAssert(
    rideId || deliveryId,
    BAD_REQUEST,
    'Must provide rideId or deliveryId'
  )

  const clip = await DashcamClipModel.create({
    driverId,
    rideId,
    deliveryId,
    note,
    status: ClipStatus.NEW,
  })

  // Signed Cloudinary config
  const timestamp = Math.floor(Date.now() / 1000)
  const publicId = `dashcam/${clip._id}`

  const signature = cloudinary.utils.api_sign_request(
    {
      public_id: publicId,
      timestamp,
    },
    process.env.CLOUDINARY_API_SECRET!
  )

  const uploadConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    timestamp,
    public_id: publicId,
    signature,
    upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
  }

  return res.status(OK).json({
    status: 'success',
    message: 'Upload ready',
    data: {
      clipId: clip._id,
      uploadConfig,
    },
  })
})




export const completeDashcamUpload = catchErrors(async (req, res) => {
  const driverId = req.user?.id
  const { clipId, cloudinaryPublicId } = req.body

  appAssert(
    clipId && cloudinaryPublicId,
    BAD_REQUEST,
    'Missing clipId or publicId'
  )

  const clip = await DashcamClipModel.findOne({
    _id: clipId,
    driverId,
  })

  appAssert(clip, BAD_REQUEST, 'Clip not found')
  clip.cloudinaryPublicId = cloudinaryPublicId
  clip.status = ClipStatus.READY
  clip.completedAt = new Date()

  await clip.save()

  return res.status(OK).json({
    status: 'success',
    message: 'Upload finalized successfully',
    data: clip,
  })
})
  