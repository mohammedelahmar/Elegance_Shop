import mongoose from "mongoose";

const CommandeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    DateCommande: { type: Date, default: Date.now },
    total_amount: { type: mongoose.Schema.Types.Decimal128, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true }); // Removed manual timestamps

const Commande = mongoose.model('Commande', CommandeSchema);
export default Commande;