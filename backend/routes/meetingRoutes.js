import express from 'express';
import {
  confirmMeeting,
  getConfirmedMeetingForRoom,
  getUpcomingMeetingsForUser,
  getConfirmedMeeting
} from '../Controllers/meetingController.js';

const router = express.Router();

router.post('/confirm', confirmMeeting);
router.get('/:roomId/confirmed', getConfirmedMeeting);
router.get("/upcoming/:userId", getUpcomingMeetingsForUser);


export default router;
