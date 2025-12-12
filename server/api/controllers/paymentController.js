import Payment from '../../models/Payment.js';
import Commande from '../../models/Commande.js';
import Product from '../../models/Product.js';
import VarianteProduct from '../../models/VarianteProduct.js';
import asyncHandler from 'express-async-handler';

const adjustInventoryForOrder = async (order) => {
    if (!order || order.inventoryAdjusted || !Array.isArray(order.orderItems) || order.orderItems.length === 0) {
        return;
    }

    for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new Error('Order references a product that no longer exists.');
        }

        if (product.stock_quantity < item.quantity) {
            throw new Error(`Insufficient remaining stock for ${product.name}.`);
        }

        product.stock_quantity -= item.quantity;
        await product.save();

        if (item.variant) {
            const variant = await VarianteProduct.findById(item.variant);
            if (!variant) {
                throw new Error('Order references a variant that no longer exists.');
            }

            if (variant.stock < item.quantity) {
                throw new Error('Insufficient remaining stock for the selected variant.');
            }

            variant.stock -= item.quantity;
            await variant.save();
        }
    }

    order.inventoryAdjusted = true;
};

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

    const order = await Commande.findById(orderId);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    const isInstantPayment = !['cash_on_delivery', 'bank_transfer'].includes(paymentMethod);

    if (isInstantPayment) {
        if (!order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now();
        }
        order.paymentResult = {
            id: paypalDetails?.id || createdPayment._id.toString(),
            status: 'completed',
            update_time: new Date().toISOString(),
            email_address: paypalDetails?.payer?.email_address || req.user.email
        };

        await adjustInventoryForOrder(order);
    } else if (paymentMethod === 'bank_transfer') {
        // For bank transfers, mark as pending but with specific status
        order.paymentResult = {
            id: createdPayment._id.toString(),
            status: 'awaiting_transfer',
            update_time: new Date().toISOString(),
            email_address: req.user.email
        };
    } else {
        // cash on delivery
        order.paymentResult = {
            id: createdPayment._id.toString(),
            status: 'pending',
            update_time: new Date().toISOString(),
            email_address: req.user.email
        };
    }

    await order.save();

    res.status(201).json(createdPayment);
});

export { processPayment };