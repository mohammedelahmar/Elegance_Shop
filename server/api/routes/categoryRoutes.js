import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } 
from '../controllers/CategoryController.js';
import { protect as authMiddleware } from '../../middlewares/authMiddleware.js';
import adminMiddleware from '../../middlewares/adminMiddleware.js'; // Corrected import

const router = express.Router();

router.get('/', getCategories);
router.post('/',createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;
