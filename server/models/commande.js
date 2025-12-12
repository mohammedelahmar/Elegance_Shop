import mongoose from "mongoose";

const CommandeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            variant: { type: mongoose.Schema.Types.ObjectId, ref: 'VarianteProduct', default: null },
            price: { type: mongoose.Schema.Types.Decimal128, required: true }
        }
    ],
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Adresses', default: null },
    paymentMethod: { type: String, default: 'credit_card' },
    itemsPrice: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    taxPrice: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    shippingPrice: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    DateCommande: { type: Date, default: Date.now },
    total_amount: { type: mongoose.Schema.Types.Decimal128, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    inventoryAdjusted: { type: Boolean, default: false },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, { timestamps: true });

const Commande = mongoose.model('Commande', CommandeSchema);
export default Commande;