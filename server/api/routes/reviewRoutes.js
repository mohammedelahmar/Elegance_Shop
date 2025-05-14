import express from 'express';
import { 
  getProductReviews, 
  addReview, 
  updateReview, 
  deleteReview,
  getAllReviews,
  updateReviewStatus,
  upload
} from '../controllers/reviewController.js';
import { protect, admin } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/product/:id', getProductReviews);
router.get('/', protect, admin, getAllReviews);
router.put('/admin/:id', protect, admin, updateReviewStatus);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Use a single route with multer middleware for handling file uploads
router.post('/', protect, upload.single('reviewImage'), addReview);

export default router;