import express from 'express';
import { addAdresse, getAdresseById, getAllAdresses, updateAdresse, deleteAdresse } from '../controllers/addressesController.js';
import { protect, admin } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addAdresse);
router.get('/', protect, admin, getAllAdresses);
router.get('/:id', protect, getAdresseById);
router.put('/:id', protect, updateAdresse);
router.delete('/:id', protect, deleteAdresse);

export default router;
