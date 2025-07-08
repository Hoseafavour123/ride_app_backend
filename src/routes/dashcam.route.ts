import { Router } from 'express'
import {
  initiateDashcamUpload,
  completeDashcamUpload,
} from '../controllers/dashcam.controller'


const dashcamRoutes = Router()



/**
 * @swagger
 * /dashcam/upload/initiate:
 *   post:
 *     summary: Initiate dashcam upload (Cloudinary signed config)
 *     tags: [Dashcam]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rideId:
 *                 type: string
 *               fileType:
 *                 type: string
 *                 example: "video/mp4"
 *     responses:
 *       200:
 *         description: Signed upload config and clip record created
 */
dashcamRoutes.post(
  '/upload/initiate',
  initiateDashcamUpload
)







/**
 * @swagger
 * /dashcam/upload/complete:
 *   post:
 *     summary: Mark uploaded dashcam clip as complete
 *     tags: [Dashcam]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clipId:
 *                 type: string
 *               cloudinaryPublicId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clip marked as completed
 */
dashcamRoutes.post(
  '/upload/complete',
  completeDashcamUpload
)

export default dashcamRoutes