const { Pool } = require('pg');

const pool = new Pool({
  user: 'slotify_team',
  host: 'localhost',
  database: 'slotify_db',
  password: 'team_password',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Connection error', err.stack);
  }
  console.log('Connected to DB successfully');
  release();
});
