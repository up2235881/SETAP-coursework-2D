// /setapCourseWork/SETAP-coursework/backend/configs/db_config.js
import { Pool } from 'pg';
import config from '../../config.js'; // Go up 3 levels to root

const pool = new Pool({
  connectionString: config.DB_URL,
});

export default pool;
