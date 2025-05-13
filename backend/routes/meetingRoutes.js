// backend/routes/meetingRoutes.js
import express from "express";
import db from "../configs/db_config.js";

const router = express.Router();

router.post("/confirm", async (req, res) => {
  const { roomId, day, time, location } = req.body;
  const userId = req.session.userId;

  if (!roomId || !day || !time || !location) {
    return res.status(400).json({ message: "Missing meeting data" });
  }

  try {
    // Check if user is room creator
    const check = await db.query(
      "SELECT creator_id FROM rooms WHERE room_id = $1",
      [roomId]
    );

    if (!check.rows.length || check.rows[0].creator_id !== userId) {
      return res
        .status(403)
        .json({ message: "Only room creator can confirm meeting" });
    }

    // Insert or update confirmed meeting
    await db.query(
      `INSERT INTO confirmed_meetings (room_id, day, time, location, confirmed_by)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (room_id)
       DO UPDATE SET day = $2, time = $3, location = $4, confirmed_by = $5, confirmed_at = CURRENT_TIMESTAMP`,
      [roomId, day, time, location, userId]
    );

    res.status(200).json({ message: "Meeting confirmed successfully" });
  } catch (err) {
    console.error("Error confirming meeting:", err);
    res.status(500).json({ message: "Failed to confirm meeting" });
  }
});

router.get("/confirmed", async (req, res) => {
  const { roomId } = req.query;
  try {
    const result = await db.query(
      "SELECT day, time, location FROM confirmed_meetings WHERE room_id = $1",
      [roomId]
    );
    res.status(200).json(result.rows[0] || {});
  } catch (err) {
    console.error("Error fetching confirmed meeting:", err);
    res.status(500).json({ message: "Failed to fetch confirmed meeting" });
  }
});

export default router;
