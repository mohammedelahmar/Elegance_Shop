import express from 'express';
import { 
  getCartItems, 
  addToCart, 
  updateCartItem, 
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCartItems);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

export default router;