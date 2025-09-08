// ייבוא פונקציות Controllers עבור פעולות המשתמש
import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../controllers/productController";
import { isAdmin } from "../middleware/isAdmin.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", authMiddleware, isAdmin, updateProductById);
router.post("/", authMiddleware, isAdmin, addProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
