import axios from './axios';

/**
 * Get user's wishlist
 * @returns {Promise} - Promise with wishlist items
 */
export const getWishlist = async () => {
  const { data } = await axios.get('/wishlist');
  return data;
};

/**
 * Add product to wishlist
 * @param {string} productId - Product ID to add
 * @returns {Promise} - Promise with updated wishlist
 */
export const addToWishlist = async (productId) => {
  const { data } = await axios.post('/wishlist', { productId });
  return data;
};

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID to remove
 * @returns {Promise} - Promise with updated wishlist
 */
export const removeFromWishlist = async (productId) => {
  const { data } = await axios.delete(`/wishlist/${productId}`);
  return data;
};

/**
 * Clear all products from wishlist
 * @returns {Promise} - Promise with empty wishlist
 */
export const clearWishlist = async () => {
  const { data } = await axios.delete('/wishlist');
  return data;
};