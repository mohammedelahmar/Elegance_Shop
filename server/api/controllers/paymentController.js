import Payment from '../../models/Payment.js';
import asyncHandler from 'express-async-handler';

// @desc   Process payment
// @route  POST /api/payment
// @access Private
const processPayment = asyncHandler(async (req, res) => {
    const { paymentMethod, amount, currency, orderId } = req.body;

    // Create payment with fields that match the schema
    const payment = new Payment({
        commande_id: orderId,  // Changed from orderId to commande_id to match schema
        payment_method: paymentMethod,  // Changed from paymentMethod to payment_method
        amount,
        status: 'completed'  // Set a default status
    });

    const createdPayment = await payment.save();
    res.status(201).json(createdPayment);
});

export { processPayment };