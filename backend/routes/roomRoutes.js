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
const Room = require('../models/roomModel');
const { nanoid } = require('nanoid');

app.post('/create-room', async (req, res) => {
    const { user_id, room_name } = req.body;

    if (!user_id || !room_name) {
        return res.status(400).json({ message: "User ID and room name are required" });
    }

    const invite_code = nanoid(8); // Generate an 8-character invite code

    try {
        // Use the createRoom function from db_config.js
        const newRoom = await db.createRoom(user_id, room_name, invite_code);

        res.status(201).json({
            message: "Room created successfully",
            room: newRoom
        });
    } catch (error) {
        // if (error.code === '23505') { // Unique constraint violation
        //     return res.status(409).json({ message: "Invite code already exists. Please try again." });
        // }
        console.error('Error creating room:', error);
        res.status(500).json({ message: "Error creating room" });
    }
});

// Route to join a room
router.post('/join-room', async (req, res) => {
    const { user_id, invite_code } = req.body; 

    // Validate input 
    if (!user_id || !invite_code) {
        return res.status(400).json({ error: 'Missing user ID or invite code' });
    }

    try {
        // Check if the room exists using the invite code
        const room = await Room.getByInviteCode(invite_code);
        if (!room) {
            return res.status(404).json({ error: 'Invalid or expired invitation code' });
        }

        // Check if the user is already in the room
        const isInRoom = await Room.checkUserInRoom(user_id, room.room_id);
        if (isInRoom) {
            return res.status(200).json({ message: `You are already a member of ${room.room_name}` });
        }

        // Add the user to the room
        await Room.addUserToRoom(user_id, room.room_id, room.room_name);
        res.status(200).json({ message: `You have successfully joined ${room.room_name}` });
    } catch (error) {
        console.error('Error joining room:', error);
        res.status(500).json({ error: 'Failed to join the room' });
    }
});

module.exports = router;