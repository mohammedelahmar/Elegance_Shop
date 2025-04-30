import axios from './axios';

/**
 * Get user's cart
 * @returns {Promise} - Promise with cart items
 */
export const getCart = async () => {
  const { data } = await axios.get('/cart');
  return data;
};

/**
 * Add item to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @param {string} variantId - Variant ID (optional)
 * @returns {Promise} - Promise with updated cart
 */
export const addToCart = async (productId, quantity = 1, variantId = null) => {
  const payload = { productId, quantity };
  if (variantId) payload.variantId = variantId;
  
  const { data } = await axios.post('/cart', payload);
  return data;
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} - Promise with updated cart
 */
export const updateCartItem = async (itemId, quantity) => {
  const { data } = await axios.put(`/cart/${itemId}`, { quantity });
  return data;
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise} - Promise with updated cart
 */
export const removeFromCart = async (itemId) => {
  const { data } = await axios.delete(`/cart/${itemId}`);
  return data;
};