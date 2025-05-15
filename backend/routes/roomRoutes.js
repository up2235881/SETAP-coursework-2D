import express from "express";
import {
  createRoom,
  joinRoom,
  listRoomUsers,
  getRoomCreator,
  getRoomsByUserId,
  getRoomInfo,
  updateRoomTheme
} from "../Controllers/roomController.js";

const router = express.Router();
router.get("/user/:id", getRoomsByUserId);

// Create a room & auto-join creator
router.post("/create", createRoom);

// Join by invite code
router.post("/join", joinRoom);


// List members of a room
router.get("/:roomId/users", listRoomUsers);

// Get the creator of a room
router.get("/:roomId/creator", getRoomCreator);

router.get("/:roomId", getRoomInfo);

router.get("/:roomId/users", listRoomUsers);

router.patch("/:roomId/theme", updateRoomTheme);
export default router;
