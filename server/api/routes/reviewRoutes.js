import express from 'express';
import { 
  getProductReviews, 
  addReview, 
  updateReview, 
  deleteReview 
} from '../controllers/reviewController.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/product/:id', getProductReviews);
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;