import Payment from '../../models/Payment.js';
import Commande from '../../models/Commande.js';
import asyncHandler from 'express-async-handler';

// @desc   Process payment
// @route  POST /api/payment
// @access Private
const processPayment = asyncHandler(async (req, res) => {
    const { paymentMethod, amount, currency, orderId, paypalDetails } = req.body;

    // Create payment record with appropriate status based on payment method
    const payment = new Payment({
        commande_id: orderId,
        payment_method: paymentMethod,
        amount,
        // Only mark as completed for immediate payment methods
        status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed'
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

    // Update order as paid only for instant payment methods (not COD or bank transfer)
    if (paymentMethod !== 'cash_on_delivery' && paymentMethod !== 'bank_transfer') {
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
    } else if (paymentMethod === 'bank_transfer') {
        // For bank transfers, mark as pending but with specific status
        const order = await Commande.findById(orderId);
        if (order) {
            order.paymentResult = {
                id: createdPayment._id.toString(),
                status: 'awaiting_transfer',
                update_time: new Date().toISOString(),
                email_address: req.user.email
            };
            
            await order.save();
        }
    }

    res.status(201).json(createdPayment);
});

export { processPayment };