import express from 'express';
import { getWishlist, addProductToWishlist, removeProductFromWishlist, clearWishlist } from '../controllers/wishlistController.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/', protect, addProductToWishlist);
router.delete('/:id', protect, removeProductFromWishlist);
router.delete('/', protect, clearWishlist);

export default router;
