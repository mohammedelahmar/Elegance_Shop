import axios from './axios';

/**
 * Get variants by product
 * @param {string} productId - Product ID
 * @returns {Promise} - Promise with list of product variants
 */
export const getVariantsByProduct = async (productId) => {
  const { data } = await axios.get(`/variants/product/${productId}`);
  return data;
};

/**
 * Create a new variant (admin only)
 * @param {Object} variantData - Variant details
 * @returns {Promise} - Promise with created variant
 */
export const createVariant = async (variantData) => {
  const { data } = await axios.post('/variants', variantData);
  return data;
};

/**
 * Update a variant (admin only)
 * @param {string} id - Variant ID
 * @param {Object} variantData - Variant data to update
 * @returns {Promise} - Promise with updated variant
 */
export const updateVariant = async (id, variantData) => {
  const { data } = await axios.put(`/variants/${id}`, variantData);
  return data;
};

/**
 * Delete a variant (admin only)
 * @param {string} id - Variant ID
 * @returns {Promise} - Promise with success message
 */
export const deleteVariant = async (id) => {
  const { data } = await axios.delete(`/variants/${id}`);
  return data;
};