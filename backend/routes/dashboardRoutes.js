const express = require('express');
const router = express.Router();
const db = require('../configs/db_config');

// Dashboard: get user’s rooms and upcoming meetings
router.get('/', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  try {
    const roomsQuery = `
      SELECT r.room_id, r.room_name
      FROM rooms r
      JOIN user_rooms ur ON ur.room_id = r.room_id
      WHERE ur.user_id = $1;
    `;
    const roomsResult = await db.query(roomsQuery, [userId]);

    const meetingsQuery = `
      SELECT m.meeting_id, m.meeting_topic, m.start_time, m.room_id, r.room_name
      FROM meetings m
      JOIN rooms r ON r.room_id = m.room_id
      JOIN user_rooms ur ON ur.room_id = r.room_id
      WHERE ur.user_id = $1 AND m.start_time > NOW()
      ORDER BY m.start_time ASC;
    `;
    const meetingsResult = await db.query(meetingsQuery, [userId]);

    res.json({
      rooms: roomsResult.rows,
      upcomingMeetings: meetingsResult.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
