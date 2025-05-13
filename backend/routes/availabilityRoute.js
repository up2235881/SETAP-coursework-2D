import express from 'express';
import db from '../configs/db_config.js';

const router = express.Router();

// Get all availability for a room
router.get('/:roomId', async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const result = await db.query(
      'SELECT * FROM availabilities WHERE room_id = $1',
      [roomId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching availabilities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user's availability in a room
router.get('/:roomId/me', async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.session.userId;

  try {
    const result = await db.query(
      'SELECT * FROM availabilities WHERE room_id = $1 AND user_id = $2',
      [roomId, userId]
    );
    res.status(200).json(result.rows[0] || null);
  } catch (error) {
    console.error('Error fetching user availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit or update user's availability for a room
router.post('/submit', async (req, res) => {
  const { roomId, day, time, location, name } = req.body;
  const userId = req.session.userId;

  try {
    const existing = await db.query(
      'SELECT * FROM availabilities WHERE room_id = $1 AND user_id = $2',
      [roomId, userId]
    );

    if (existing.rows.length > 0) {
      // Update
      await db.query(
        'UPDATE availabilities SET day = $1, time = $2, location = $3 WHERE room_id = $4 AND user_id = $5',
        [name, day, time, location, roomId, userId]
      );
    } else {
      // Insert
      await db.query(
        'INSERT INTO availabilities (user_id, room_id, day, time, location) VALUES ($1, $2, $3, $4, $5)',
        [userId, roomId, name, day, time, location]
      );
    }

    res.status(200).json({ message: 'Availability saved' });
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
