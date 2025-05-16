// /setapCourseWork/config.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Loads .env from root (same folder as config.js)
dotenv.config({
  path: path.resolve(__dirname, "./.env"),
});

const config = {
  DB_URL: process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  API_URL: process.env.API_URL,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};

export default config;
