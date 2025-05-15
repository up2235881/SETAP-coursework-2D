// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import availabilityRoute from './routes/availabilityRoute.js';
import meetingRoute     from './routes/meetingRoutes.js';
import notesRoute       from './routes/notesRoutes.js';
import dashboardRoute   from './routes/dashboardRoutes.js';
import roomRoute        from './routes/roomRoutes.js';
import userRoute        from './routes/userRoutes.js';

dotenv.config();

const app = express();

// ─── ES-MODULE __dirname SHIM ───────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────

// Enable CORS to allow your frontend to talk to this API
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session support (so req.session.user_id is available in controllers)
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// ─── SERVE FRONTEND ───────────────────────────────────────────────────────────

// Serve all files in your frontend/ folder
app.use(express.static(path.join(__dirname, '../frontend')));

// If you want `/` to always serve landingpage.html explicitly:
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/landingpage.html'));
});

// ─── API ROUTES ───────────────────────────────────────────────────────────────

// Availability endpoints
app.use('/availability', availabilityRoute);

// Meeting confirmation endpoints
app.use('/meeting', meetingRoute);

// Notes CRUD endpoints
app.use('/notes', notesRoute);

// User dashboard (rooms + upcoming meetings)
app.use('/dashboard', dashboardRoute);

// Room management (create, join, list members, get creator)
app.use('/rooms', roomRoute);

// User auth & management (register, login, CRUD)
app.use('/users', userRoute);

// ─── START SERVER ─────────────────────────────────────────────────────────────

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
