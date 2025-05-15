import db from '../configs/db_config.js';

/**
 * POST /meeting/confirm
 * Only the room creator may confirm or update a meeting.
 */
export const confirmMeeting = async (req, res) => {
  const { roomId, day, time, location } = req.body;
  const userId = req.session.user_id;

  if (!userId || !roomId || !day || !time || !location) {
    return res.status(400).json({ message: 'Missing meeting data or not logged in' });
  }

  try {
    // Verify room exists and the user is its creator
    const roomRes = await db.query(
      'SELECT user_id AS creator_id FROM rooms WHERE room_id = $1',
      [roomId]
    );
    if (roomRes.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (roomRes.rows[0].creator_id !== userId) {
      return res.status(403).json({ message: 'Only the creator can confirm the meeting' });
    }

    // Upsert into confirmed_meetings
    await db.query(
      `INSERT INTO confirmed_meetings (room_id, day, time, location, confirmed_by)
         VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (room_id)
       DO UPDATE SET
         day = EXCLUDED.day,
         time = EXCLUDED.time,
         location = EXCLUDED.location,
         confirmed_by = EXCLUDED.confirmed_by,
         confirmed_at = CURRENT_TIMESTAMP`,
      [roomId, day, time, location, userId]
    );

    return res.status(200).json({ message: 'Meeting confirmed' });
  } catch (err) {
    console.error('Error confirming meeting:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /meeting/:roomId/confirmed
 * Retrieve the confirmed meeting for a room.
 */
export const getConfirmedMeeting = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  if (isNaN(roomId)) {
    return res.status(400).json({ message: 'Invalid room ID' });
  }

  try {
    const { rows } = await db.query(
      'SELECT day, time, location FROM confirmed_meetings WHERE room_id = $1',
      [roomId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No confirmed meeting' });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error fetching confirmed meeting:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
