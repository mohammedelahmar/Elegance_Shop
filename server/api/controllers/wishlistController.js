import Wishlist from "../../models/Wishlist";
import asyncHandler from "express-async-handler";
import { protect as authMiddleware } from "../../middlewares/authMiddleware";
import adminMiddleware from "../../middlewares/adminMiddleware";

// @desc   Get the current user's wishlist
// @route  GET /api/wishlist
// @access Private
const getWishlist = asyncHandler(async (req, res) => {
     try {
          const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    return res.status(200).json(wishlist || { products: [] });
          
     } catch (error) {
          return res.status(500).json({ message: error.message });
          
     }
}
);

// @desc   Add a product to the current user's wishlist
// @route  POST /api/wishlist
// @access Private

const addProductToWishlist = asyncHandler(async (req, res) => {
     try {
          const UserId = req.user._id;
          const { productId } = req.body;
          const wishlist = await Wishlist.findOne({ user: UserId});
          if(!wishlist){
               const newWishlist = new Wishlist({
                    user: UserId,
                    products: [productId]
               });    
          }else{
               if(!wishlist.products.includes(productID)){
                    wishlist.products.push(productId);
               }
          }
          await wishlist.save();
          return res.status(200).json(wishlist);

          
     } catch (error) {
          return res.status(500).json({ message: error.message });
          
     }
}
);

// @desc   Remove a product from the current user's wishlist
// @route  DELETE /api/wishlist/:productId
// @access Private

const removeProductFromWishlist = asyncHandler(async (req, res) => {
     try {
          const userId = req.user._id;
          const { productId } = req.params;
          const wishlist = await Wishlist.findOne({ user: userId });
          if(wishlist){
               wishlist.products = wishlist.products.filter(product => product.toString() !== productId);
               await wishlist.save();
          }
          return res.status(200).json(wishlist);
          
     } catch (error) {
          return res.status(500).json({ message: error.message });
          
     }
}
);

// @desc   Clear the current user's wishlist
// @route  DELETE /api/wishlist
// @access Private

const clearWishlist = asyncHandler(async (req, res) => {
     try {
          const userId = req.user._id;
          const wishlist = await Wishlist.findOne({ user: userId });
          if(wishlist){
               wishlist.products = [];
               await wishlist.save();
          }
          return res.status(200).json(wishlist);
          
     } catch (error) {
          return res.status(500).json({ message: error.message });
          
     }
}
);


export { getWishlist, addProductToWishlist, removeProductFromWishlist, clearWishlist };

