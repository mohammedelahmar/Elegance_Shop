import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/passwordController.js';

const router = express.Router();

// Now these will be available at /api/password/forgot and /api/password/reset/:token
router.post('/forgot', forgotPassword);
router.put('/reset/:resetToken', resetPassword);

export default router;