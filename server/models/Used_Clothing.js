const UsedClothingSchema = new mongoose.Schema({
     seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
     condition: { type: String, required: true },
     price: { type: mongoose.Schema.Types.Decimal128, required: true },
     description: String,
     status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
     created_at: { type: Date, default: Date.now },
     updated_at: { type: Date, default: Date.now }
 }, { timestamps: true });
 const UsedClothing = mongoose.model('UsedClothing', UsedClothingSchema);
 export default UsedClothing;
