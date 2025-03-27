const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Join room route
router.post('/join-room', roomController.joinRoom);

module.exports = router;