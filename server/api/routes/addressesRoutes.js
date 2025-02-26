import express from 'express';
import { addAddress, getAddressById, getAddresses, updateAddress,deleteAdresse } from '../controllers/addressesController.js';
import { protect as authMiddleware } from '../../middlewares/authMiddleware.js';
import adminMiddleware from '../../middlewares/adminMiddleware.js'; // Corrected import

const router = express.Router();

router.post('/', authMiddleware, addAddress);
router.get('/', authMiddleware, adminMiddleware, getAddresses);
router.get('/:id', authMiddleware, getAddressById);
router.put('/:id', authMiddleware, updateAddress);
router.delete('/:id', authMiddleware, deleteAdresse);

export default router;
