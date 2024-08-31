import express from "express";
import { createUser, login, logout } from "../controllers/user.js";
import { singleAvatar } from "../middleware/multer.js";

const router = express.Router();

router.post("/signUp", singleAvatar, createUser);
router.post("/login", login);
router.post("/logout", logout);

export default router;
