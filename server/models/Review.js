import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    product_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
