// ייבוא פונקציות Controllers עבור פעולות המשתמש
import {
  register,
  verifyUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  loginAdmin,
  verifyAdminOtp,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import express from "express";
const router = express.Router();
import { isAdmin } from "../middleware/isAdmin.ts";

router.post("/admin/verify-otp", isAdmin, verifyAdminOtp);
router.post("/admin/login", isAdmin, loginAdmin);
router.post("/register", register);
router.get("/verify/:userId/:token", verifyUser);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
