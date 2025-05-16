import { nanoid } from "nanoid";
import db from "../configs/db_config.js";

/**
 * POST /rooms/create
 * Create a new room and auto-join the creator.
 */
export const createRoom = async (req, res) => {
  const userId = req.session.user_id;
  const { roomName } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  if (!roomName) {
    return res.status(400).json({ message: "Room name is required" });
  }

  const inviteCode = nanoid(10);
  try {
    const insert = await db.query(
      `INSERT INTO rooms (user_id, room_name, invite_code)
       VALUES ($1, $2, $3)
       RETURNING room_id, invite_code`,
      [userId, roomName, inviteCode]
    );
    const roomId = insert.rows[0].room_id;

    // auto-join creator
    await db.query(
      `INSERT INTO room_participants (user_id, room_id, joined_at)
       VALUES ($1, $2, NOW())`,
      [userId, roomId]
    );

    return res.status(201).json({
      room_id: roomId,
      room_name: roomName,
      invite_code: inviteCode,
      message: "Room created",
    });
  } catch (err) {
    console.error("Error creating room:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /rooms/join
 * Join an existing room by invite code.
 */
export const joinRoom = async (req, res) => {
  const userId = req.session.user_id;
  const { inviteCode } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  if (!inviteCode) {
    return res.status(400).json({ message: "Invite code is required" });
  }

  try {
    const roomRes = await db.query(
      "SELECT room_id FROM rooms WHERE invite_code = $1",
      [inviteCode]
    );
    if (roomRes.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }
    const roomId = roomRes.rows[0].room_id;

    // already joined?
    const mem = await db.query(
      "SELECT 1 FROM room_participants WHERE user_id = $1 AND room_id = $2",
      [userId, roomId]
    );
    if (mem.rows.length) {
      return res.status(400).json({ message: "Already in room" });
    }

    await db.query(
      `INSERT INTO room_participants (user_id, room_id, joined_at)
       VALUES ($1, $2, NOW())`,
      [userId, roomId]
    );
    return res.status(200).json({ message: "Joined room" });
  } catch (err) {
    console.error("Error joining room:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /rooms/:roomId/users
 * List all members of a room.
 */
export const listRoomUsers = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  if (isNaN(roomId)) {
    return res.status(400).json({ message: "Invalid room ID" });
  }

  try {
    const { rows } = await db.query(
      `SELECT u.user_id, u.user_username
       FROM room_participants rp
       JOIN users u ON rp.user_id = u.user_id
       WHERE rp.room_id = $1`,
      [roomId]
    );
    return res.status(200).json(rows); // ✅ return array of users
  } catch (err) {
    console.error("Error fetching room members:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /rooms/:roomId/creator
 * Return the creator of a room.
 */
export const getRoomCreator = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  if (isNaN(roomId)) {
    return res.status(400).json({ message: "Invalid room ID" });
  }

  try {
    const { rows } = await db.query(
      "SELECT user_id AS creator_id FROM rooms WHERE room_id = $1",
      [roomId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }
    return res.status(200).json({ creator_id: rows[0].creator_id });
  } catch (err) {
    console.error("Error fetching room creator:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /rooms/user/:id — get all rooms for a user
export const getRoomsByUserId = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const { rows } = await db.query(
      `SELECT r.room_id, r.room_name, r.invite_code
         FROM rooms r
         JOIN room_participants rp ON r.room_id = rp.room_id
        WHERE rp.user_id = $1`,
      [userId]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoomInfo = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  if (isNaN(roomId)) {
    return res.status(400).json({ message: "Invalid room ID" });
  }

  try {
    const result = await db.query(
      "SELECT room_id, room_name, invite_code, theme FROM rooms WHERE room_id = $1",
      [roomId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json(result.rows[0]); // ✅ everything the frontend needs
  } catch (err) {
    console.error("Error fetching room info:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRoomTheme = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  const { theme } = req.body;

  if (isNaN(roomId) || !["light", "dark"].includes(theme)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    await db.query(
      "UPDATE rooms SET theme = $1, updated_at = NOW() WHERE room_id = $2",
      [theme, roomId]
    );
    return res.status(200).json({ message: "Theme updated" });
  } catch (err) {
    console.error("Error updating room theme:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export async function leaveRoom(req, res) {
  const userId = req.session.user_id;
  const roomId = req.params.id; // ✅ CORRECTED

  console.log("LEAVING ROOM", { userId, roomId });

  try {
    const result = await db.query(
      "DELETE FROM room_participants WHERE user_id = $1 AND room_id = $2",
      [userId, roomId]
    );

    console.log("DELETE result:", result);

    res.status(200).json({
      message: "Left room successfully",
      deletedCount: result.rowCount,
    });
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({ message: "Error leaving room" });
  }
}
