import Payment from '../../models/Payment.js';
import asyncHandler from 'express-async-handler';

// @desc   Process payment
// @route  POST /api/payment
// @access Private
const processPayment = asyncHandler(async (req, res) => {
    const { paymentMethod, amount, currency, orderId, userId } = req.body;

    const payment = new Payment({
        paymentMethod,
        amount,
        currency,
        orderId,
        userId
    });

    const createdPayment = await payment.save();
    res.status(201).json(createdPayment);
});