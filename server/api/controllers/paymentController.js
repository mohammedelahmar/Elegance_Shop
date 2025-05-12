import Payment from '../../models/Payment.js';
import Commande from '../../models/Commande.js';
import asyncHandler from 'express-async-handler';

// @desc   Process payment
// @route  POST /api/payment
// @access Private
const processPayment = asyncHandler(async (req, res) => {
    const { paymentMethod, amount, currency, orderId, paypalDetails } = req.body;

    // Create payment record
    const payment = new Payment({
        commande_id: orderId,
        payment_method: paymentMethod,
        amount,
        status: 'completed'
    });

    // If this is PayPal, save additional details
    if (paymentMethod === 'paypal' && paypalDetails) {
        payment.transaction_details = {
            transaction_id: paypalDetails.id,
            payer_id: paypalDetails.payer?.payer_id,
            payer_email: paypalDetails.payer?.email_address,
            payment_status: paypalDetails.status,
            payment_time: paypalDetails.create_time
        };
    }

    const createdPayment = await payment.save();

    // Update order as paid
    const order = await Commande.findById(orderId);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: paypalDetails?.id || createdPayment._id.toString(),
            status: 'completed',
            update_time: new Date().toISOString(),
            email_address: paypalDetails?.payer?.email_address || req.user.email
        };
        
        await order.save();
    }

    res.status(201).json(createdPayment);
});

export { processPayment };