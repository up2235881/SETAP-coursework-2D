// backend/test-db.js

import pkg from 'pg';
const { Pool } = pkg;
import config from '../config.js';

const pool = new Pool({
  connectionString: config.DB_URL,
});

console.log({ config });

(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to DB successfully');
    client.release();
  } catch (err) {
    console.error('Connection error', err.stack);
  }
})();
