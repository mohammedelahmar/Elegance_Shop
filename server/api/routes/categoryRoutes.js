import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } 
from '../controllers/CategoryController.js';
import { protect, admin } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, admin, createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
