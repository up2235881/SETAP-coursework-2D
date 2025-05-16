import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getMe,
  getConfirmedMeetingsByUser
} from "../Controllers/userController.js";

const router = express.Router();

// Public / unauthenticated
router.post("/", createUser); // register
router.post("/login", loginUser); // login

// All other user ops
router.get("/me", getMe);
router.get("/", getUsers);
router.get("/:id/confirmed-meetings", getConfirmedMeetingsByUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
export default router;
