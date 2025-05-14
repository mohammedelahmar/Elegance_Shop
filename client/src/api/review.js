import axios from './axios';

/**
 * Get reviews for a product
 * @param {string} productId - Product ID
 * @returns {Promise} Promise with review data
 */
export const getProductReviews = async (productId) => {
  const { data } = await axios.get(`/reviews/product/${productId}`);
  return data;
};

/**
 * Create a new review with optional image
 * @param {FormData} formData - Review data including optional image
 * @returns {Promise} Promise with created review
 */
export const createReview = async (formData) => {
  // Log the form data content for debugging
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  const { data } = await axios.post('/reviews', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
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

/**
 * Get all reviews (admin only)
 * @param {Object} params - Query parameters (page, limit, etc)
 * @returns {Promise} - Promise with list of all reviews
 */
export const getAllReviews = async (params = {}) => {
  const { data } = await axios.get('/reviews', { params });
  return data;
};

/**
 * Update review status (admin only)
 * @param {string} id - Review ID
 * @param {Object} updateData - Data to update (approved, etc)
 * @returns {Promise} - Promise with updated review
 */
export const updateReviewStatus = async (id, updateData) => {
  const { data } = await axios.put(`/reviews/admin/${id}`, updateData);
  return data;
};