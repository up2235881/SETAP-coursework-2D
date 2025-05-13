const { Pool } = require("pg");
const config = require("../config");

const pool = new Pool({
  connectionString: config.DB_URL,
});

console.log({ config });

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Connection error", err.stack);
  }
  console.log("Connected to DB successfully");
  release();
});
