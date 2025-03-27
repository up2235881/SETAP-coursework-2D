const db = require('./configs/db_config')
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
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ message: "Invite code already exists. Please try again." });
        }
        console.error('Error creating room:', error);
        res.status(500).json({ message: "Error creating room" });
    }
});