import express from 'express';
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered } from '../controllers/commandeController.js';
import { protect as authMiddleware } from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js"; // Corrected import

const router = express.Router();

router.post('/', authMiddleware, addOrderItems);
router.get('/', authMiddleware, adminMiddleware, getOrders);
router.get('/myorders', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/pay', authMiddleware, updateOrderToPaid);
router.put('/:id/deliver', authMiddleware, adminMiddleware, updateOrderToDelivered);

export default router;
