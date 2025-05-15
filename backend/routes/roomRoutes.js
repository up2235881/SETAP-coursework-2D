import express from 'express';
import {
  createRoom,
  joinRoom,
  listRoomUsers,
  getRoomCreator,
  getRoomsByUser
} from '../Controllers/roomController.js';

const router = express.Router();

// Create a room & auto-join creator
router.post('/create', createRoom);

// Join by invite code
router.post('/join', joinRoom);

// List members of a room
router.get('/:roomId/users', listRoomUsers);

// Get the creator of a room
router.get('/:roomId/creator', getRoomCreator);

export default router;
