import db from "../configs/db_config.js";

// GET /availability/:roomId
export const getAvailabilityByRoom = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  if (isNaN(roomId)) {
    return res.status(400).json({ message: "Invalid room ID" });
  }

  try {
    const { rows } = await db.query(
      `SELECT availability_id, user_id, day, time, location, submitted_at
       FROM availabilities WHERE room_id = $1`,
      [roomId]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching availability:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /availability/:roomId
export const createAvailability = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  const userId = req.session.user_id;
  const { day, time, location } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    await db.query(
      `INSERT INTO availabilities (user_id, room_id, day, time, location)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, roomId, day, time, location]
    );
    return res.status(201).json({ message: "Availability created" });
  } catch (err) {
    console.error("Error creating availability:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
