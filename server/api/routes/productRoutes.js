import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController.js";

import { protect as authMiddleware } from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js"; // Corrected import

const router = express.Router();

router.get("/", getProducts);
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.get("/:id", getProductById);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
