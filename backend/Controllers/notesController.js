import db from '../configs/db_config.js';

/**
 * GET /notes/:roomId
 * List all notes in a room, with author.
 */
export const getNotesByRoom = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  if (isNaN(roomId)) {
    return res.status(400).json({ message: 'Invalid room ID' });
  }

  try {
    const { rows } = await db.query(
      `SELECT
         n.note_id, n.title, n.content, n.created_at,
         u.user_username AS created_by
       FROM notes n
       JOIN users u ON n.user_id = u.user_id
       WHERE n.room_id = $1
       ORDER BY n.created_at DESC`,
      [roomId]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching notes:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /notes/:roomId
 * Create a new note.
 */
export const createNote = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  const userId = req.session.user_id;
  const { title, content } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  if (!roomId || !title || !content) {
    return res.status(400).json({ message: 'Missing note data' });
  }

  try {
    const insert = await db.query(
      `INSERT INTO notes (user_id, room_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING note_id, title, content, created_at`,
      [userId, roomId, title, content]
    );
    return res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error('Error creating note:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PUT /notes/:roomId/:noteId
 * Update an existing note (only owner).
 */
export const updateNote = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  const noteId = parseInt(req.params.noteId, 10);
  const userId = req.session.user_id;
  const { title, content } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  if (isNaN(roomId) || isNaN(noteId) || !title || !content) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    // Verify ownership
    const check = await db.query(
      'SELECT user_id FROM notes WHERE note_id = $1 AND room_id = $2',
      [noteId, roomId]
    );
    if (check.rows.length === 0 || check.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await db.query(
      `UPDATE notes
         SET title = $1,
             content = $2
       WHERE note_id = $3
         AND room_id = $4
       RETURNING note_id, title, content`,
      [title, content, noteId, roomId]
    );
    return res.status(200).json(updated.rows[0]);
  } catch (err) {
    console.error('Error updating note:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * DELETE /notes/:roomId/:noteId
 * Delete a note (only owner).
 */
export const deleteNote = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  const noteId = parseInt(req.params.noteId, 10);
  const userId = req.session.user_id;

  if (!userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  if (isNaN(roomId) || isNaN(noteId)) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    // Verify ownership
    const check = await db.query(
      'SELECT user_id FROM notes WHERE note_id = $1 AND room_id = $2',
      [noteId, roomId]
    );
    if (check.rows.length === 0 || check.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await db.query(
      'DELETE FROM notes WHERE note_id = $1 AND room_id = $2',
      [noteId, roomId]
    );
    return res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    console.error('Error deleting note:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
