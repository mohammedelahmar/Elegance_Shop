//# same pattern

import axios from './axios';

/**
 * Get all categories
 * @returns {Promise} - Promise with list of categories
 */
export const getAllCategories = async () => {
  const { data } = await axios.get('/categories');
  return data;
};

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise} - Promise with category details
 */
export const getCategoryById = async (id) => {
  const { data } = await axios.get(`/categories/${id}`);
  return data;
};

/**
 * Create a new category (admin only)
 * @param {Object} categoryData - Category details
 * @returns {Promise} - Promise with created category
 */
export const createCategory = async (categoryData) => {
  const { data } = await axios.post('/categories', categoryData);
  return data;
};

/**
 * Update a category (admin only)
 * @param {string} id - Category ID
 * @param {Object} categoryData - Category data to update
 * @returns {Promise} - Promise with updated category
 */
export const updateCategory = async (id, categoryData) => {
  const { data } = await axios.put(`/categories/${id}`, categoryData);
  return data;
};

/**
 * Delete a category (admin only)
 * @param {string} id - Category ID
 * @returns {Promise} - Promise with success message
 */
export const deleteCategory = async (id) => {
  const { data } = await axios.delete(`/categories/${id}`);
  return data;
};