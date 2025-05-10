import express from 'express';
import { addAdresse, getAdresseById, getAllAdresses, updateAdresse, deleteAdresse } from '../controllers/addressesController.js';
import { protect, admin } from '../../middlewares/authMiddleware.js';
import Adresses from "../../models/Adresses.js"; // Add this import

const router = express.Router();

router.post('/', protect, addAdresse);
router.get('/', protect, admin, getAllAdresses);

// Move the /user route BEFORE the /:id route
router.get('/user', protect, async (req, res) => {
     try {
       const addresses = await Adresses.find({ user: req.user._id });
       res.json(addresses);
     } catch (error) {
       res.status(500).json({ message: 'Failed to fetch addresses' });
     }
   });
   
// Keep these routes after the /user route
router.get('/:id', protect, getAdresseById);
router.put('/:id', protect, updateAdresse);
router.delete('/:id', protect, deleteAdresse);

export default router;
