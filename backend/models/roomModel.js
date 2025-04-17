const pool = require('../configs/db_config');
const { randomUUID } = require('crypto');

const createRoom = (req,res) => {
    const { roomName } = req.body

    if(!roomName ) {
        return res.status(400).json({message : "Room name is required to continue."});
    }
    const user_id = req.session.user_id;
    if(!user_id) return res.status(401).json({message : "Unauthorized - please log in" });
    const inviteCode = randomUUID().slice(0, 6);
    pool.query('INSERT INTO rooms (user_id, room_name, invite_code) VALUES ($1, $2, $3) RETURNING *', 
        [user_id, roomName, inviteCode], (error, results) => {
        if (error) {
            return res.status(500).json({message : error.message});
        }
        res.status(201).json({message : "Room has successfully been created!", room: results.rows[0 ]});
    });
};

const getRoomById = (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ message : "Invalid room ID" });
    pool.query('SELECT * FROM rooms WHERE room_id = $1', [id], (error, results) => {
        if (error) {
            return res.status(500).json({message : error.message});
        }
        if (results.rows.lengh === 0){
            return res.status(404).json({message : "Room not found" });
        }
        res.status(200).json(results.rows[0]);
    });
};

const getRoomByName = (req,res) => {
    const { roomName } = req.body

    if (!roomName) {
        return res.status(400).json({message: "A room name is required."})
    }
    pool.query('SELECT * FROM rooms WHERE room_name = $1', [roomName], (error, results) => {
        if (error) {
            return res.status(500).json({message : error.message});
        }
        if (results.rows.length === 0) return res.status(404).json({ message : "Room not found" });
        res.status(200).json(results.rows[0]);
    });
};

const updateRoom = (req, res) => {
    const id = parseInt(req.params.id)
    const {roomName} = req.body

    pool.query(
        'UPDATE rooms SET room_name = $1 WHERE room_id = $2', [roomName, id], (error, results) => {
            if (error){
                return res.status(500).json({message : error.message});
            }
            res.status(200).json('Room has been updated!')
        }
    )
}

const deleteRoom = (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('DELETE FROM rooms WHERE room_id = $1', [id], (error, results) =>{
        if(error) {
            return res.status(500).json({message : error.message});
        }
        res.status(200).json('Room has officially been deleted.')
    })
}

const Room = {

    // Get room by invite code
    async getByInviteCode(invite_code) {
        const query = 'SELECT room_id, room_name, invite_code FROM rooms WHERE invite_code = $1';
        const { rows } = await pool.query(query, [invite_code]); 
        return rows[0] || null; // Return first room found or null if not found
    },

    // Check if a user is already in the room
    async checkUserInRoom(user_id, room_id) {
        const query = 'SELECT * FROM room_participants WHERE user_id = $1 AND room_id = $2';
        const { rows } = await pool.query(query, [user_id, room_id]); // Query the room_participants table
        return rows.length > 0; // Return true if user is found, false otherwise
    },

    // Add a user to the room and create a notification
    async addUserToRoom(user_id, room_id, room_name) {
        const client = await pool.connect(); 
        try {
            await client.query('BEGIN'); 
            // Insert user into the room_participants table
            await client.query(
                'INSERT INTO room_participants (user_id, room_id, joined_at) VALUES ($1, $2, NOW())',
                [user_id, room_id]);
            // Create a notification for the user
            await client.query(
                'INSERT INTO notifications (user_id, notification_type, message, sent_at, notification_status, expiration_date) ' +
                'VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP + INTERVAL \'7 days\')',
                [user_id, 'General', `You have joined the room "${room_name}`, 'Sent']
            );
            await client.query('COMMIT'); // Commit the transaction if everything is successful
            return true;
        } catch (error) {
            await client.query('ROLLBACK'); // Rollback the transaction in case of an error
            console.error('Error adding user to room:', error);
            throw error;
        } finally {
            client.release(); 
        }
    }

};

const joinRoom = async (req, res) => {
    const { user_id, inviteCode } = req.body;
    try {
        const room = await Room.getByInviteCode(inviteCode);
        if (!room) return res.status(404).json({ message : "Room not found" });
        await Room.addUserToRoom(user_id, room.room_id, room.roomName);
        res.status(200).json({ message : "Joined room!"});
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
};


// Export the Room model

module.exports = {
    createRoom,
    getRoomById,
    getRoomByName,
    updateRoom, 
    deleteRoom, 
    getByInviteCode : Room.getByInviteCode,
    checkUserInRoom : Room.checkUserInRoom,
    addUserToRoom : Room.addUserToRoom,
    joinRoom
};