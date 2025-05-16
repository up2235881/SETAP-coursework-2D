import express from 'express';
import {
  getAvailabilityByRoom,
  createAvailability,
  getMyAvailabilityInRoom
} from '../Controllers/availabilityController.js';

const router = express.Router();

router.get('/:roomId', getAvailabilityByRoom);
router.post('/:roomId', createAvailability);
router.get('/:roomId/me', getMyAvailabilityInRoom);

export default router;
