import axios from './axios';

/**
 * Create a product review
 * @param {Object} reviewData - Review details including product, rating, comment
 * @returns {Promise} - Promise with created review
 */
export const createReview = async (reviewData) => {
  const { data } = await axios.post('/reviews', reviewData);
  return data;
};

/**
 * Get all reviews for a product
 * @param {string} productId - Product ID
 * @returns {Promise} - Promise with list of reviews
 */
export const getProductReviews = async (productId) => {
  const { data } = await axios.get(`/reviews/product/${productId}`);
  return data;
};

/**
 * Delete a review
 * @param {string} id - Review ID
 * @returns {Promise} - Promise with success message
 */
export const deleteReview = async (id) => {
  const { data } = await axios.delete(`/reviews/${id}`);
  return data;
};