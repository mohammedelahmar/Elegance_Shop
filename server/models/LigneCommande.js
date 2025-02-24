import mongoose from 'mongoose';

const LigneCommandeSchema = new mongoose.Schema({
    commande_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price_per_unit: { type: mongoose.Schema.Types.Decimal128, required: true },
    subtotal: { type: mongoose.Schema.Types.Decimal128, required: true }
}, { timestamps: true });

const LigneCommande = mongoose.model('LigneCommande', LigneCommandeSchema);
export default LigneCommande;