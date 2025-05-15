// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import db from "./configs/db_config.js";

import availabilityRoute from "./routes/availabilityRoute.js";
import meetingRoute from "./routes/meetingRoutes.js";
import notesRoute from "./routes/notesRoutes.js";
import dashboardRoute from "./routes/dashboardRoutes.js";
import roomRoute from "./routes/roomRoutes.js";
import userRoute from "./routes/userRoutes.js";

dotenv.config();

// ES‐module __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;

// ─── SERVE FRONTEND STATIC ASSETS ─────────────────────────────────────────────
app.use(express.static("../frontend", { extensions: ["html"] }));
app.use(
  express.static(path.join(__dirname, "../frontend/landingpage"), {
    index: "index.html",
  })
);

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production" },
  })
);

// ─── API ROUTES ────────────────────────────────────────────────────────────────
app.use("/api/availability", availabilityRoute);
app.use("/api/meeting", meetingRoute);
app.use("/api/notes", notesRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/users", userRoute);

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});

setInterval(() => {
  db.query("SELECT 1").catch((err) => {
    console.error("Keep-alive DB ping failed:", err.message);
  });
}, 100 * 60 * 1000);
