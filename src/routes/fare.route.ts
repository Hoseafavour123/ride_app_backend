import { Router } from 'express'
import { estimateFareHandler } from '../controllers/fare_estimate'

const fareRoutes = Router()

fareRoutes.post('/estimate', estimateFareHandler)

export default fareRoutes