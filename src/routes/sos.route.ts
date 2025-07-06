import { Router } from 'express'
import { triggerSOSHandler } from '../controllers/sos.controller'
const sosRoutes = Router()

sosRoutes.post('/trigger', triggerSOSHandler)

export default sosRoutes