const express = require("express");
const { nanoid } = require("nanoid");
const db = require("../configs/db_config");

const router = express.Router();

// Middleware to require login
router.use((req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
});

// Create a new room
router.post("/create", async (req, res) => {
  const userId = req.session.userId;
  const { room_name } = req.body;

  if (!room_name) {
    return res.status(400).json({ message: "Room name is required" });
  }

  const inviteCode = nanoid(8);

  try {
    const createRoomQuery = `
      INSERT INTO rooms (room_name, invite_code)
      VALUES ($1, $2)
      RETURNING room_id;
    `;
    const roomResult = await db.query(createRoomQuery, [room_name, inviteCode]);

    const roomId = roomResult.rows[0].room_id;

    const linkUserQuery = `
      INSERT INTO user_rooms (user_id, room_id)
      VALUES ($1, $2);
    `;
    await db.query(linkUserQuery, [userId, roomId]);

    res.status(201).json({ message: "Room created successfully", inviteCode });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Join a room by invite code
router.post("/join", async (req, res) => {
  const userId = req.session.userId;
  const { room_code } = req.body;

  if (!room_code) {
    return res.status(400).json({ message: "Room code is required" });
  }

  try {
    const roomQuery = `
      SELECT room_id FROM rooms WHERE invite_code = $1;
    `;
    const result = await db.query(roomQuery, [room_code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    const roomId = result.rows[0].room_id;

    // Check if already joined
    const checkQuery = `
      SELECT * FROM user_rooms WHERE user_id = $1 AND room_id = $2;
    `;
    const check = await db.query(checkQuery, [userId, roomId]);

    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Already in the room" });
    }

    const joinQuery = `
      INSERT INTO user_rooms (user_id, room_id)
      VALUES ($1, $2);
    `;
    await db.query(joinQuery, [userId, roomId]);

    res.status(200).json({ message: "Successfully joined the room" });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
