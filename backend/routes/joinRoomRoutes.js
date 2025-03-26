const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Join room route
router.post('/join-room', roomController.joinRoom);

module.exports = router;

// middleware/authMiddleware.js
module.exports = (req, res, next) => {
    if (!req.session.user_id) {
        return res.status(401).json({ error: 'You must be logged in to join a room' });
    }
    next(); 
};