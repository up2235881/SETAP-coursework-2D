// /setapCourseWork/SETAP-coursework/backend/test-db.js
import pool from './configs/db_config.js'; // Relative path from backend to configs

(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to DB successfully');
    client.release();
  } catch (err) {
    console.error('Connection error', err.stack);
  }
})();
