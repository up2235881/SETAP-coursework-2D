import db from "../configs/db_config.js";

/**
 * GET /users
 * List all users.
 */
export const getUsers = async (_req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT user_id, user_username, user_email, created_at, updated_at FROM users"
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /users/:id
 * Fetch a single user by ID.
 */
export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  try {
    const { rows } = await db.query(
      "SELECT user_id, user_username, user_email, created_at, updated_at FROM users WHERE user_id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /users    or   POST /register
 * Create (register) a new user.
 */
export const createUser = async (req, res) => {
  const { user_username, user_email, user_password } = req.body;
  if (!user_username || !user_email || !user_password) {
    return res.status(400).json({ message: "Missing user data" });
  }
  try {
    // check for existing
    const dup = await db.query(
      "SELECT 1 FROM users WHERE user_username = $1 OR user_email = $2",
      [user_username, user_email]
    );
    if (dup.rows.length) {
      return res
        .status(409)
        .json({ message: "Username or email already in use" });
    }

    const insert = await db.query(
      `INSERT INTO users (user_username, user_email, user_password)
       VALUES ($1, $2, $3)
       RETURNING user_id, user_username, user_email`,
      [user_username, user_email, user_password]
    );
    // start session
    req.session.user_id = insert.rows[0].user_id;
    return res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /login
 * Authenticate and log in a user by username or email.
 */
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body; // identifier = username OR email
  if (!identifier || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const { rows } = await db.query(
      `SELECT user_id, user_password
       FROM users
       WHERE user_username = $1 OR user_email = $1`,
      [identifier]
    );
    if (rows.length === 0 || rows[0].user_password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // store in session
    req.session.user_id = rows[0].user_id;
    return res.status(200).json({ message: "Logged in" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * PUT /users/:id
 * Update an existing user's username or email or password.
 */
export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { user_username, user_email, user_password } = req.body;
  if (isNaN(id) || (!user_username && !user_email && !user_password)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  // build SET clause dynamically
  const fields = [];
  const values = [];
  let idx = 1;
  if (user_username) {
    fields.push(`user_username = $${idx++}`);
    values.push(user_username);
  }
  if (user_email) {
    fields.push(`user_email = $${idx++}`);
    values.push(user_email);
  }
  if (user_password) {
    fields.push(`user_password = $${idx++}`);
    values.push(user_password);
  }
  values.push(id);

  try {
    const { rows } = await db.query(
      `UPDATE users
         SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $${idx}
       RETURNING user_id, user_username, user_email`,
      values
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /users/:id
 * Remove a user.
 */
export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  try {
    await db.query("DELETE FROM users WHERE user_id = $1", [id]);
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.session.user_id) {
      return res.status(401).json({ error: "Not logged in" });
    }
    // Fetch user from DB (example for PostgreSQL with pg)
    const result = await db.query(
      "SELECT user_id, user_username, user_email FROM users WHERE user_id = $1",
      [req.session.user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
