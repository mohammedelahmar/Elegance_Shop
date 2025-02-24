import mongoose from "mongoose"; // Added import

const CartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
}, { timestamps: true }); // Removed manual timestamps

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;