import express from 'express';
import { processPayment } from '../controllers/paymentController.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, processPayment);

export default router;