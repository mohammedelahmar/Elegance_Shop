import mongoose from "mongoose";
const VarianteProductSchema = new mongoose.Schema({
     product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
     taille: { type: String, required: true },
     couleur: { type: String, required: true },
     stock: { type: Number, required: true, min: 0 },
     created_at: { type: Date, default: Date.now },
     updated_at: { type: Date, default: Date.now }
     }, { timestamps: true });
     const VarianteProduct = mongoose.model('VarianteProduct', VarianteProductSchema);
     export default VarianteProduct;