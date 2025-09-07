// ייבוא פונקציות Controllers עבור פעולות המשתמש
import {
  deleteUser,
  fetchDeleteUser,
  fetchUser,
  fetchUserById,
  totalUsers,
  updateProfile,
} from "../controllers/userController.ts";

// ייבוא Express ו־Middleware לאימות משתמשים
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
const router = express.Router();

router.get("/admin/:id", fetchUserById);
router.delete("/admin/delete/:id", deleteUser);
router.get("/admin", totalUsers);
router.get("/", authMiddleware, fetchUser);
router.delete("/delete", authMiddleware, fetchDeleteUser);
router.put("/profile", authMiddleware, updateProfile);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
