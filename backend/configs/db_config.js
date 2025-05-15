// backend/configs/db_config.js
import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
  // If you ever split into DB_HOST/DB_USER/etc, you can use those instead here.
});

export default pool;
