const Room = require('../models/roomModel');

const roomService = {
    // Method to handle the process of joining a room
    async joinRoom(user_id, invite_code) {
        if (!user_id || !invite_code) {
            throw new Error('User ID or invite code is missing');
        }

        // Get the room by invite code
        const room = await Room.getByInviteCode(invite_code);
        if (!room) {
            throw new Error('Invalid invitation code');
        }

        // Check if the user is already in the room
        const isInRoom = await Room.checkUserInRoom(user_id, room.room_id);
        if (isInRoom) {
            return { message: `You are already a member of ${room.room_name}` };
        }

        // Add the user to the room and create a notification
        const success = await Room.addUserToRoom(user_id, room.room_id, room.room_name);
        if (success) {
            return { message: `You have successfully joined ${room.room_name}` };
        } else {
            throw new Error('Failed to join the room');
        }
    }
};

module.exports = roomService;