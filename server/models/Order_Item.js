const OrderItemSchema = new mongoose.Schema({
     order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
     product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
     quantity: { type: Number, required: true, min: 1 },
     price_per_unit: { type: mongoose.Schema.Types.Decimal128, required: true },
     subtotal: { type: mongoose.Schema.Types.Decimal128, required: true }
 }, { timestamps: true });
 const OrderItem = mongoose.model('OrderItem', OrderItemSchema);
 export default OrderItem;

 