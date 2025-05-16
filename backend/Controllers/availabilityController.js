import db from "../configs/db_config.js";

// GET /availability/:roomId
export const getAvailabilityByRoom = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  if (isNaN(roomId)) {
    return res.status(400).json({ message: "Invalid room ID" });
  }

  try {
    const { rows } = await db.query(
      `SELECT availability_id, user_id, day, start_time, end_time, location, created_at
FROM availability
WHERE room_id = $1
`,
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
  const { day, start_time, end_time, location } = req.body;

  if (!userId) return res.status(401).json({ message: "Not logged in" });

  try {
    // check if this user already has availability for this room
    const { rowCount } = await db.query(
      `SELECT 1 FROM availability WHERE user_id = $1 AND room_id = $2`,
      [userId, roomId]
    );

    if (rowCount > 0) {
      // update
      await db.query(
        `UPDATE availability SET day = $1, start_time = $2, end_time = $3, location = $4, updated_at = NOW()
         WHERE user_id = $5 AND room_id = $6`,
        [day, start_time, end_time, location, userId, roomId]
      );
    } else {
      // insert
      await db.query(
        `INSERT INTO availability (user_id, room_id, day, start_time, end_time, location)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, roomId, day, start_time, end_time, location]
      );
    }

    res.status(200).json({ message: "Availability saved" });
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: "Error saving availability" });
  }
};

export const getMyAvailabilityInRoom = async (req, res) => {
  const userId = req.session.user_id;
  const roomId = parseInt(req.params.roomId, 10);

  if (!userId) return res.status(401).json({ message: "Not logged in" });

  try {
    const { rows } = await db.query(
      `SELECT day, start_time, end_time, location
   FROM availability
   WHERE user_id = $1 AND room_id = $2`,
      [userId, roomId]
    );

    res.status(200).json(rows[0] || null);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Error loading availability" });
  }
};
