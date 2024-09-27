import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { attachmentsMulter, handleFormData } from "../middleware/multer.js";

import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMember,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
} from "../controllers/chat.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/newGroupChat", newGroupChat);
router.post("/addMember", addMember);
router.post("/removeMember", removeMember);
router.get("/getMyChats", getMyChats);
router.get("/getMyGroups", getMyGroups);
router.delete("/leaveGroup/:id", leaveGroup);

router.post("/sendAttachments", attachmentsMulter, sendAttachments);
router.get("/:id", getChatDetails);
router.post("/renameGroup/:id", handleFormData, renameGroup);
router.delete("/deleteChat/:id", deleteChat);

router.get("/getMessage/:id", getMessages);

export default router;
