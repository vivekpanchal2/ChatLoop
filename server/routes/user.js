import express from "express";

import {
  createUser,
  login,
  logout,
  searchUser,
  getMyProfile,
  sendFriendRequest,
  getMyNotifications,
  acceptFriendRequest,
  getMyFriends,
  cancelSendFriendRequest,
} from "../controllers/user.js";
import { singleAvatar } from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/signUp", singleAvatar, createUser);
router.post("/login", login);

router.use(isAuthenticated);

router.get("/logout", logout);
router.get("/getMyProfile", getMyProfile);
router.get("/searchUser", searchUser);

router.post("/sendFriendRequest", sendFriendRequest);

router.delete("/cancelSendFriendRequest", cancelSendFriendRequest);

router.get("/getMyNotifications", getMyNotifications);
router.post("/acceptFriendRequest", acceptFriendRequest);
router.get("/getMyFriends", getMyFriends);

export default router;
