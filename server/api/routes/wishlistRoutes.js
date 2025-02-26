import express from 'express';
import { getWishlist, addProductToWishlist, removeProductFromWishlist, clearWishlist } from '../controllers/wishlistController.js';
import { protect as authMiddleware } from '../../middlewares/authMiddleware.js';
import adminMiddleware from '../../middlewares/adminMiddleware.js'; // Corrected import

const router = express.Router();

router.get('/', authMiddleware, getWishlist);
router.post('/', authMiddleware, addProductToWishlist);
router.delete('/:id', authMiddleware, removeProductFromWishlist);
router.delete('/', authMiddleware, clearWishlist);

export default router;
