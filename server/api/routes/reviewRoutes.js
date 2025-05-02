import express from 'express';
import { 
  getProductReviews, 
  addReview, 
  updateReview, 
  deleteReview,
  getAllReviews,
  updateReviewStatus
} from '../controllers/reviewController.js';
import { protect, admin } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/product/:id', getProductReviews);
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.get('/', protect, admin, getAllReviews);
router.put('/admin/:id', protect, admin, updateReviewStatus);

export default router;