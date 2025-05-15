import express from 'express';
import {
  getAvailabilityByRoom,
  createAvailability
} from '../Controllers/availabilityController.js';

const router = express.Router();

router.get('/:roomId', getAvailabilityByRoom);
router.post('/:roomId', createAvailability);

export default router;
