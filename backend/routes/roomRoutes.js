const express = require('express');
const router = express.Router();
const Room = require('../models/roomModel');

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