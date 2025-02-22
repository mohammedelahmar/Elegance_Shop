import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
     user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     order_date: { type: Date, default: Date.now },
     total_amount: { type: mongoose.Schema.Types.Decimal128, required: true },
     status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
     created_at: { type: Date, default: Date.now },
     updated_at: { type: Date, default: Date.now }
 }, { timestamps: true });
 const order = mongoose.model('Order', OrderSchema);

 