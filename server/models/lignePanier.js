import mongoose from "mongoose";

const LignePanierSchema = new mongoose.Schema({
    panier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Panier', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
}, { timestamps: true });

const LignePanier = mongoose.model('LignePanier', LignePanierSchema);
export default LignePanier;