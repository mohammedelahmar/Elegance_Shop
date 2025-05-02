import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    commentaire: { type: String, required: true },
    approved: { type: Boolean, default: false } // Add this field
}, { timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
