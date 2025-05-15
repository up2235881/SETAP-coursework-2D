import express from 'express';
import {
  getNotesByRoom,
  createNote,
  updateNote,
  deleteNote
} from '../Controllers/notesController.js';

const router = express.Router();

router.get('/:roomId', getNotesByRoom);
router.post('/:roomId', createNote);
router.put('/:roomId/:noteId', updateNote);
router.delete('/:roomId/:noteId', deleteNote);

export default router;
