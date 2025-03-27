const db = require('../configs/db_config');


const Room = {
    // Get room by invite code
    async getByInviteCode(invite_code) {
        const query = 'SELECT room_id, room_name, invite_code FROM rooms WHERE invite_code = $1';
        const { rows } = await db.query(query, [invite_code]); 
        return rows[0] || null; // Return first room found or null if not found
    },

    // Check if a user is already in the room
    async checkUserInRoom(user_id, room_id) {
        const query = 'SELECT * FROM room_participants WHERE user_id = $1 AND room_id = $2';
        const { rows } = await db.query(query, [user_id, room_id]); // Query the room_participants table
        return rows.length > 0; // Return true if user is found, false otherwise
    },

    // Add a user to the room and create a notification
    async addUserToRoom(user_id, room_id, room_name) {
        const client = await db.connect(); 
        try {
            await client.query('BEGIN'); 

            // Insert user into the room_participants table
            await client.query(
                'INSERT INTO room_participants (user_id, room_id, joined_at) VALUES ($1, $2, NOW())',
                [user_id, room_id]
            );

            // Create a notification for the user
            const message = `You have joined the room "${room_name}"`;
            await client.query(
                `INSERT INTO notifications 
                (user_id, message, sent_at, notification_status, expiration_date)
                VALUES ($1, $2, CURRENT_TIMESTAMP, 'Sent', CURRENT_TIMESTAMP + INTERVAL '7 days')`,
                [user_id, message]
            );

            await client.query('COMMIT'); // Commit the transaction if everything is successful
            return true;
        } catch (error) {
            await client.query('ROLLBACK'); // Rollback the transaction in case of an error
            console.error('Error adding user to room:', error);
            throw new Error('Failed to add user to room or send notification');
        } finally {
            client.release(); 
        }
    }
};

// Export the Room model
module.exports = Room;