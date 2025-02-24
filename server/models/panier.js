import mongoose from "mongoose";
const PanierSchema = new mongoose.Schema({
     user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
     listPanier : { type: Array, required: true },
     quantity: { type: Number, required: true, min: 1 },
     created_at: { type: Date, default: Date.now },
     updated_at: { type: Date, default: Date.now }
     }, { timestamps: true });
const Panier = mongoose.model('Panier', PanierSchema);
export default Panier;