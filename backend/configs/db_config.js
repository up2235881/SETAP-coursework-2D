// backend/controllers/userController.js

import { Pool } from "pg";
import config from "../../config.js";

console.log(config.DB_USER);

const pool = new Pool({
  connectionString: config.DB_URL,
});

export const getUsers = (req, res) => {
  pool.query("SELECT * FROM users ORDER BY user_id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

export const getUserById = (req, res) => {
  const id = parseInt(req.params.id, 10);

  pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

export const getUserByUsernameOrEmail = (req, res) => {
  const { username, email, password } = req.body;

  pool.query(
    "SELECT * FROM users WHERE user_username = $1 OR user_email = $2",
    [username, email],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      if (results.rows.length > 0) {
        const user = results.rows[0];
        if (user.user_password === password) {
          return res.status(200).json({
            message: `You have signed in successfully, welcome back ${
              user.user_username || user.user_email
            }!`,
          });
        } else {
          return res
            .status(401)
            .json({ message: "Invalid credentials. Try again" });
        }
      } else {
        return res
          .status(401)
          .json({ message: "Invalid credentials. Try again" });
      }
    }
  );
};

export const createUser = (req, res) => {
  const { username, email, password } = req.body;

  pool.query(
    "INSERT INTO users (user_username, user_email, user_password) VALUES ($1, $2, $3) RETURNING user_id",
    [username, email, password],
    (error, results) => {
      if (error) {
        throw error;
      }
      res
        .status(201)
        .json({ message: "User added", id: results.rows[0].user_id });
    }
  );
};

export const updateUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { username, email, password } = req.body;

  pool.query(
    "UPDATE users SET user_username = $1, user_email = $2, user_password = $3 WHERE user_id = $4",
    [username, email, password, id],
    (error) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ message: `User modified with id ${id}` });
    }
  );
};

export const deleteUser = (req, res) => {
  const id = parseInt(req.params.id, 10);

  pool.query(
    "DELETE FROM users WHERE user_id = $1",
    [id],
    (error) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ message: `User deleted with ID: ${id}` });
    }
  );
};
