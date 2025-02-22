import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
     product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
     user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     rating: { type: Number, required: true, min: 1, max: 5 },
     comment: { type: String, required: true },
     created_at: { type: Date, default: Date.now },
     updated_at: { type: Date, default: Date.now }
 }, { timestamps: true });
 const Review = mongoose.model('Review', ReviewSchema);
    export default Review;
 