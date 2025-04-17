const { Pool } = require('pg');

const pool = new Pool ({
    user:'slotify_team',
    host: 'localhost',
    database: 'slotify_db',
    password:'team_password',
    port: 5432,
});

module.exports = pool;