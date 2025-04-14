import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';

/**
 * @desc    Get all cart items for a user
 * @route   GET /api/cart
 * @access  Private
 */
const getCartItems = async (req, res, next) => {
  try {
    const cartItems = await Cart.find({ user_id: req.user._id })
      .populate('product_id', 'name price image_url');
    
    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to cart
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(product_id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if product is already in cart
    const existingCartItem = await Cart.findOne({ 
      user_id: req.user._id,
      product_id
    });

    if (existingCartItem) {
      // Update quantity if product already in cart
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      
      res.status(200).json({
        success: true,
        message: 'Cart updated successfully',
        data: existingCartItem
      });
    } else {
      // Add new item to cart
      const cartItem = await Cart.create({
        user_id: req.user._id,
        product_id,
        quantity
      });

      res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: cartItem
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:id
 * @access  Private
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1');
    }

    let cartItem = await Cart.findById(req.params.id);
    
    if (!cartItem) {
      res.status(404);
      throw new Error('Cart item not found');
    }

    // Ensure user can only modify their own cart
    if (cartItem.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this cart item');
    }

    cartItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    ).populate('product_id', 'name price image_url');

    res.status(200).json({
      success: true,
      data: cartItem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:id
 * @access  Private
 */
const removeFromCart = async (req, res, next) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    
    if (!cartItem) {
      res.status(404);
      throw new Error('Cart item not found');
    }

    // Ensure user can only modify their own cart
    if (cartItem.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to remove this cart item');
    }

    await cartItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear user's cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res, next) => {
  try {
    await Cart.deleteMany({ user_id: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

export {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};