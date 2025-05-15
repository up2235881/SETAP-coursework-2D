import express from "express";
import path from "path";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import availabilityRoutes from "./routes/availabilityRoute.js";
import notesRoutes from "./routes/notesRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Redirect root to landing page
app.get("/", (req, res) => {
  res.redirect("/landingpage/index.html");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/notes", notesRoutes);

import meetingRoutes from "./routes/meetingRoutes.js";
app.use("/api/meetings", meetingRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
