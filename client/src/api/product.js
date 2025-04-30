//# getAll, getById, admin create/update/delete

import axios from './axios';

/**
 * Get all products with optional filters
 * @param {Object} params - Query parameters (keyword, category, page, limit)
 * @returns {Promise} - Promise with products and pagination data
 */
export const getAllProducts = async (params = {}) => {
  try {
    const { data } = await axios.get('/products', { 
      params,
      timeout: 10000 // 10 second timeout
    });
    return data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      throw new Error(`Error: ${error.message}`);
    }
  }
};

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise} - Promise with product details
 */
export const getProductById = async (id) => {
  const { data } = await axios.get(`/products/${id}`);
  return data;
};

/**
 * Create a new product (admin only)
 * @param {Object} productData - Product details
 * @returns {Promise} - Promise with created product
 */
export const createProduct = async (productData) => {
  const { data } = await axios.post('/products', productData);
  return data;
};

/**
 * Update a product (admin only)
 * @param {string} id - Product ID
 * @param {Object} productData - Product data to update
 * @returns {Promise} - Promise with updated product
 */
export const updateProduct = async (id, productData) => {
  const { data } = await axios.put(`/products/${id}`, productData);
  return data;
};

/**
 * Delete a product (admin only)
 * @param {string} id - Product ID
 * @returns {Promise} - Promise with success message
 */
export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`/products/${id}`);
  return data;
};