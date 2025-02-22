import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema({
     order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
     payment_date: { type: Date, default: Date.now },
     payment_method: { type: String, enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'], required: true },
     amount: { type: mongoose.Schema.Types.Decimal128, required: true },
     status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
 }, { timestamps: true });
const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
 