require("dotenv").config({
  path: require("path").resolve(__dirname, "./.env"),
});

module.exports = {
  DB_URL: process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  API_URL: process.env.API_URL,
};
