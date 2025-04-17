const db = require('../configs/db_config');

const Room = {

    // New function to create a room in the database
    async createRoom (user_id, room_name, invite_code) {
    try {
        const results = await pool.query(
            'INSERT INTO rooms (user_id, room_name, invite_code) VALUES ($1, $2, $3) RETURNING *',
            [user_id, room_name, invite_code]
        );
        return results.rows[0]; // Return the created room data
    } catch (error) {
        throw error; // Re-throw the error to be handled in the route
    }
    },
    
    // Get a room by its invite code
    async getByInviteCode(invite_code) {
        const query = 'SELECT room_id, room_name FROM rooms WHERE invite_code = $1';
        const { rows } = await db.query(query, [invite_code]);
        return rows[0] || null; // Return the room if found, otherwise null
    },

    // Check if a user is already in the room
    async checkUserInRoom(user_id, room_id) {
        const query = 'SELECT * FROM room_participants WHERE user_id = $1 AND room_id = $2';
        const { rows } = await db.query(query, [user_id, room_id]);
        return rows.length > 0; // Return true if the user is found in the room
    },

    // Add a user to a room and create a notification
    async addUserToRoom(user_id, room_id, room_name) {
        const client = await db.connect(); // Connect to the database
        try {
            await client.query('BEGIN'); // Start a transaction

            // Insert the user into the room participants table
            await client.query(
                'INSERT INTO room_participants (user_id, room_id, joined_at) VALUES ($1, $2, NOW())',
                [user_id, room_id]
            );

            // Create a notification for the user
            const message = `You have joined the room "${room_name}"`;
            await client.query(
                `INSERT INTO notifications 
                (user_id, message, sent_at, notification_status, expiration_date) VALUES ($1, $2, CURRENT_TIMESTAMP, 'Sent', CURRENT_TIMESTAMP + INTERVAL '7 days')`,
                [user_id, message]
            );

            await client.query('COMMIT'); // Commit the transaction if successful
            return true;
        } catch (error) {
            await client.query('ROLLBACK'); // Rollback transaction in case of an error
            throw error;
        } finally {
            client.release(); // Release the database connection back to the pool
        }
    }
};

module.exports = Room;