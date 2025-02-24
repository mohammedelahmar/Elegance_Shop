import mongoose from "mongoose";
const LignePanierSchema = new mongoose.Schema({
     panier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'panier', required: true },
     product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
     quantity: { type: Number, required: true, min: 1 },
     created_at: { type: Date, default: Date.now },
     updated_at: { type: Date, default: Date.now }
     }, { timestamps: true });
const LignePanier = mongoose.model('LignePanier', LignePanierSchema);
export default LignePanier;