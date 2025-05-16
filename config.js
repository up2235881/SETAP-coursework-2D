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
  DB_URL: config.HOST.DATABASE_URL || config.HOST.DATABASE_PUBLIC_URL,
  DB_USER: config.HOST.DB_USER,
  DB_HOST: config.HOST.DB_HOST,
  DB_NAME: config.HOST.DB_NAME,
  DB_PASSWORD: config.HOST.DB_PASSWORD,
  DB_PORT: config.HOST.DB_PORT,
  API_URL: config.HOST.API_URL,
};

export default config;
