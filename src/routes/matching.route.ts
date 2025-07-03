import { Router } from 'express';
import { notifyDriversHandler } from '../controllers/matching.controller';

const router = Router();

// prefix: /api/v1/matching
router.post(
  '/notify-drivers/:rideId',
  notifyDriversHandler
);

export default router;