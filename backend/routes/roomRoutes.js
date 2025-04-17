const express = require('express');
const router = express.Router();
const { createRoom, getRoomById, getRoomByName, updateRoom, deleteRoom, joinRoom} = require('../models/roomModel');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/rooms', authMiddleware,createRoom);
router.get('/rooms/:id', getRoomById);
router.post('/rooms/by-name', getRoomByName);
router.put('/rooms/:id', updateRoom);
router.put('/rooms/:id', deleteRoom);
router.post('/joinRoom');

module.exports = router;