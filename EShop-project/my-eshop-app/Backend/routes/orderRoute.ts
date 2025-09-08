// ייבוא פונקציות Controllers עבור פעולות המשתמש
import {
  getOrder,
  updateDelivered,
  getAllOrderUser,
  getAllOrders,
  getOrdersAdmin,
  deleteOrdersAdmin,
} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { isAdmin } from "../middleware/isAdmin.ts";
import express from "express";
const router = express.Router();

router.delete("/admin/:id", isAdmin, deleteOrdersAdmin);
router.get("/admin/userOrders/:id", isAdmin, getOrdersAdmin);
router.get("/admin", isAdmin, getAllOrders);
router.get("/:id", authMiddleware, getOrder);
router.put("/:id", authMiddleware, updateDelivered);
router.get("/", authMiddleware, getAllOrderUser);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
