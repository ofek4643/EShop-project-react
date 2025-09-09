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
  logoutAdmin,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware.ts"; // אימות משתמש
import { isAdmin } from "../middleware/isAdmin.ts"; // אימות מנהל
import express from "express";
const router = express.Router();

router.post("/admin/verify-otp", verifyAdminOtp);
router.post("/admin/login", loginAdmin);
router.post("/register", register);
router.get("/verify/:userId/:token", verifyUser);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/logout/admin", authMiddleware, isAdmin, logoutAdmin);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
