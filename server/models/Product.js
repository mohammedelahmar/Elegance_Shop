import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    price: { type: mongoose.Schema.Types.Decimal128, required: true },
    stock_quantity: { type: Number, required: true, min: 0 },
    image_url: { type: String, default: "" },
    is_new: { type: Boolean, default: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
    // Removed created_at and updated_at since timestamps option is used.
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
