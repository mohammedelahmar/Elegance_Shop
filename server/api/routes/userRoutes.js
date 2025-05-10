import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  promoteToAdmin,
  changePassword,  // Import the new function
  resetPassword    // Import the resetPassword function
} from '../controllers/userController.js';
import { protect, admin } from '../../middlewares/authMiddleware.js';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  idValidation,
  updateUserValidation
} from '../validators/userValidators.js';
import bcrypt from 'bcryptjs';


const router = express.Router();

// Public routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateProfileValidation, updateUserProfile);

// Add the change password route
router.put('/change-password', protect, changePassword);

// Separate endpoint for password reset
router.put('/password/reset/:token', resetPassword);

// Admin routes
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, idValidation, getUserById)
  .put(protect, admin, updateUserValidation, updateUser)
  .delete(protect, admin, idValidation, deleteUser);

router.put('/:id/promote', protect, admin, promoteToAdmin);

export default router;
