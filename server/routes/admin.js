import express from "express";
import { adminOnly } from "../middleware/auth.js";
import {
  adminLogin,
  adminLogout,
  getAllUsers,
  getAdminData,
  getAllMessages,
  getAllChats,
  getDashboardStats,
} from "../controllers/admin.js";

const router = express.Router();

router.post("/adminLogin", adminLogin);
router.use(adminOnly);

router.get("/getAllUsers", getAllUsers);
router.get("/getAdminData", getAdminData);
router.get("/getAllChats", getAllChats);
router.get("/getAllMessages", getAllMessages);
router.get("/getDashboardStats", getDashboardStats);
router.post("/adminLogout", adminLogout);

export default router;
