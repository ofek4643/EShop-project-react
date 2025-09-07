// ייבוא פונקציות Controllers עבור פעולות המשתמש
import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../controllers/productController";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProductById); // admin
router.post("/", addProduct);
router.delete("/:id", deleteProduct);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
