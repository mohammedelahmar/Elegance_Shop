import express from 'express';
import { processPayment } from '../controllers/paymentController.js';
import { protect as authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, processPayment);

export default router;