import db from '../configs/db_config.js';

/**
 * GET /dashboard
 * Return the current user’s rooms and upcoming confirmed meetings.
 */
export const getDashboard = async (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    // 1) All rooms the user created or joined
    const roomsResult = await db.query(
      `SELECT r.room_id, r.room_name
       FROM rooms r
       WHERE r.user_id = $1
       UNION
       SELECT r2.room_id, r2.room_name
       FROM rooms r2
       JOIN user_rooms ur ON r2.room_id = ur.room_id
       WHERE ur.user_id = $1`,
      [userId]
    );

    // 2) All upcoming confirmed meetings in those rooms
    const meetingsResult = await db.query(
      `SELECT cm.room_id, r.room_name, cm.day, cm.time, cm.location
       FROM confirmed_meetings cm
       JOIN rooms r ON cm.room_id = r.room_id
       WHERE (r.user_id = $1)
         OR EXISTS (
           SELECT 1 FROM user_rooms ur
           WHERE ur.room_id = r.room_id
             AND ur.user_id = $1
         )
       ORDER BY cm.confirmed_at DESC`,
      [userId]
    );

    return res.status(200).json({
      rooms: roomsResult.rows,
      upcomingMeetings: meetingsResult.rows
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
