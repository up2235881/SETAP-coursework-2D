// backend/controllers/roomController.js

import pool from "../configs/db_config.js";
import { randomUUID } from "crypto";

export const createRoom = (req, res) => {
  const { roomName } = req.body;

  if (!roomName) {
    return res
      .status(400)
      .json({ message: "Room name is required to continue." });
  }

  const user_id = req.session.user_id;
  if (!user_id) {
    return res
      .status(401)
      .json({ message: "Unauthorized - please log in" });
  }

  const inviteCode = randomUUID().slice(0, 6);

  pool.query(
    "INSERT INTO rooms (user_id, room_name, invite_code) VALUES ($1, $2, $3) RETURNING *",
    [user_id, roomName, inviteCode],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      res.status(201).json({
        message: "Room has successfully been created!",
        room: results.rows[0],
      });
    }
  );
};

export const getRoomById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid room ID" });
  }

  pool.query(
    "SELECT * FROM rooms WHERE room_id = $1",
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.status(200).json(results.rows[0]);
    }
  );
};

export const getRoomByName = (req, res) => {
  const { roomName } = req.body;

  if (!roomName) {
    return res
      .status(400)
      .json({ message: "A room name is required." });
  }

  pool.query(
    "SELECT * FROM rooms WHERE room_name = $1",
    [roomName],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.status(200).json(results.rows[0]);
    }
  );
};

export const updateRoom = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { roomName } = req.body;

  if (!roomName) {
    return res
      .status(400)
      .json({ message: "Room name required" });
  }

  pool.query(
    "UPDATE rooms SET room_name = $1 WHERE room_id = $2",
    [roomName, id],
    (error) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      res.status(200).json({ message: "Room updated!" });
    }
  );
};

export const deleteRoom = (req, res) => {
  const id = parseInt(req.params.id, 10);

  pool.query(
    "DELETE FROM rooms WHERE room_id = $1",
    [id],
    (error) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      res.status(200).json({ message: "Room has officially been deleted." });
    }
  );
};

// --- Advanced Room model operations ---

const RoomModel = {
  async getByInviteCode(invite_code) {
    const query =
      "SELECT room_id, room_name, invite_code FROM rooms WHERE invite_code = $1";
    const { rows } = await pool.query(query, [invite_code]);
    return rows[0] || null;
  },

  async checkUserInRoom(user_id, room_id) {
    const query =
      "SELECT * FROM room_participants WHERE user_id = $1 AND room_id = $2";
    const { rows } = await pool.query(query, [user_id, room_id]);
    return rows.length > 0;
  },

  async addUserToRoom(user_id, room_id, room_name) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "INSERT INTO room_participants (user_id, room_id, joined_at) VALUES ($1, $2, NOW())",
        [user_id, room_id]
      );
      await client.query(
        `INSERT INTO notifications
         (user_id, notification_type, message, sent_at, notification_status, expiration_date)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP + INTERVAL '7 days')`,
        [user_id, "General", `You have joined room ${room_name}`, "Sent"]
      );
      await client.query("COMMIT");
      return true;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
};

export const getByInviteCode = RoomModel.getByInviteCode;
export const checkUserInRoom = RoomModel.checkUserInRoom;
export const addUserToRoom = RoomModel.addUserToRoom;

export const joinRoom = async (req, res) => {
  const { inviteCode } = req.body;
  const user_id = req.session.userId;

  if (!user_id || !inviteCode) {
    return res
      .status(400)
      .json({ message: "User ID and invite code required" });
  }

  try {
    const room = await RoomModel.getByInviteCode(inviteCode);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const alreadyIn = await RoomModel.checkUserInRoom(user_id, room.room_id);
    if (alreadyIn) {
      return res
        .status(400)
        .json({ message: "User already in room!" });
    }

    await RoomModel.addUserToRoom(
      user_id,
      room.room_id,
      room.room_name
    );
    res.status(200).json({ message: "Joined room!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
