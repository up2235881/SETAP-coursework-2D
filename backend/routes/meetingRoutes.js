import express from 'express';
import {
  confirmMeeting,
  getConfirmedMeeting
} from '../Controllers/meetingController.js';

const router = express.Router();

router.post('/confirm', confirmMeeting);
router.get('/:roomId/confirmed', getConfirmedMeeting);

export default router;
