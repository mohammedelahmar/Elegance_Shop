import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
     }, { timestamps: true });     

     const Wishlist = mongoose.model('Wishlist', WishlistSchema);
     export default Wishlist;
