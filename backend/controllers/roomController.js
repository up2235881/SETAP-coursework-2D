const roomService = require('../services/roomService');

const roomController = {
    async joinRoom(req, res) {
        const { invite_code } = req.body;
        const user_id = req.session.user_id; 

        if (!invite_code || !user_id) {
            return res.status(400).json({ error: 'Missing invite code or user ID' });
        }

        try {
            const result = await roomService.joinRoom(user_id, invite_code);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error joining room:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = roomController;