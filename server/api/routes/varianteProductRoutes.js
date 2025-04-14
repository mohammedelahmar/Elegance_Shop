import express from 'express';
import { 
  getVarianteProducts, 
  createVarianteProduct, 
  getVarianteProductById, 
  updateVarianteProduct, 
  deleteVarianteProduct 
} from '../controllers/varianteProductController.js';
import { protect, admin } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getVarianteProducts);
router.post('/', protect, admin, createVarianteProduct);
router.get('/:id', protect, getVarianteProductById);
router.put('/:id', protect, admin, updateVarianteProduct);
router.delete('/:id', protect, admin, deleteVarianteProduct);

export default router;