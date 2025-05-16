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
  DB_URL: process.env.HOST || process.env.DATABASE_PUBLIC_URL,
  DB_USER: process.env.HOST,
  DB_HOST: process.env.HOST,
  DB_NAME: process.env.HOST,
  DB_PASSWORD: process.env.HOST,
  DB_PORT: process.env.HOST,
  API_URL: process.env.HOST,
};

export default config;
