import { Router } from 'express'
import {
  initiateDashcamUpload,
  completeDashcamUpload,
} from '../controllers/dashcam.controller'


const dashcamRoutes = Router()

dashcamRoutes.post(
  '/upload/initiate',
  initiateDashcamUpload
)

dashcamRoutes.post(
  '/upload/complete',
  completeDashcamUpload
)

export default dashcamRoutes