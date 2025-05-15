import { Pool } from "pg";
import config from "../config.js";

const pool = new Pool({
  connectionString: config.DB_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Connection error", err.stack);
  }
  console.log("Connected to DB successfully");
  release();
});

