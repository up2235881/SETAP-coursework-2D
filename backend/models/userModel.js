// backend/routes/roomRoutes.js

import express from "express";
import {
  createRoom,
  getRoomById,
  getRoomByName,
  updateRoom,
  deleteRoom,
  joinRoom,
} from "../controllers/roomController.js";

const router = express.Router();

// Protect all of these routes: require a logged-in user
router.use((req, res, next) => {
  if (!req.session.user_id) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
});

// POST   /rooms/create      → createRoom
// POST   /rooms/join       → joinRoom
// GET    /rooms/:id        → getRoomById
// POST   /rooms/find       → getRoomByName
// PUT    /rooms/:id        → updateRoom
// DELETE /rooms/:id        → deleteRoom

router.post("/create", createRoom);
router.post("/join", joinRoom);
router.get("/:id", getRoomById);
router.post("/find", getRoomByName);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;
