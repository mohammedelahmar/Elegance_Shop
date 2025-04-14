import mongoose from "mongoose";

const PanierSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listPanier: { type: Array, required: true },
    quantity: { type: Number, required: true, min: 1 }
}, { timestamps: true });

const Panier = mongoose.model('Panier', PanierSchema);
export default Panier;