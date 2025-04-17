const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');
const session = require('express-session');
const joinRoomRoutes = require('./routes/roomRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const db = require('./configs/db_config');
const {createUser} = require('./models/userModel');
const port = 3000;

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const roomRoutes = require('./routes/roomRoutes');
app.use('/api', roomRoutes);

app.use('/api/rooms', authMiddleware, joinRoomRoutes);
app.use(express.static(path.join(__dirname, '../frontend'))); 
app.use(cors({origin : 'http://localhost:3000' }));
app.use(express.json());

// Middleware for session 
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'secret_key', 
    resave: false, 
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.get('/login', (req, res) => {
    res.send({
        username : req.body.username,
        password : req.body.password
    })
})

app.listen(port, () => console.log(`app listening on port ${port}`));