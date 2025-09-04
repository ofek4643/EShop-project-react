// ייבוא פונקציות Controllers עבור פעולות המשתמש
import { getOrder, updateDelivered , getAllOrderUser , getAllOrders} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import {isAdmin} from "../middleware/isAdmin.ts"
import express from "express";
const router = express.Router();

router.get("/:id", authMiddleware, getOrder);
router.put("/:id", authMiddleware, updateDelivered);
router.get("/", authMiddleware, getAllOrderUser);
router.get("/admin/lala", getAllOrders);


// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
