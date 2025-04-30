//# profile, admin user CRUD

import axios from './axios';

/**
 * Get current user profile
 * @returns {Promise} - Promise with user profile data
 */
export const getUserProfile = async () => {
  const { data } = await axios.get('/users/profile');
  return data;
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @returns {Promise} - Promise with updated user data
 */
export const updateUserProfile = async (userData) => {
  const { data } = await axios.put('/users/profile', userData);
  return data;
};

/**
 * Get all users (admin only)
 * @returns {Promise} - Promise with array of all users
 */
export const getAllUsers = async () => {
  const { data } = await axios.get('/users');
  return data;
};

/**
 * Get user by ID (admin only)
 * @param {string} id - User ID
 * @returns {Promise} - Promise with user data
 */
export const getUserById = async (id) => {
  const { data } = await axios.get(`/users/${id}`);
  return data;
};

/**
 * Update user (admin only)
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise} - Promise with updated user data
 */
export const updateUser = async (id, userData) => {
  const { data } = await axios.put(`/users/${id}`, userData);
  return data;
};

/**
 * Delete user (admin only)
 * @param {string} id - User ID
 * @returns {Promise} - Promise with success message
 */
export const deleteUser = async (id) => {
  const { data } = await axios.delete(`/users/${id}`);
  return data;
};

/**
 * Promote user to admin (admin only)
 * @param {string} id - User ID
 * @returns {Promise} - Promise with updated user data
 */
export const promoteUser = async (id) => {
  const { data } = await axios.put(`/users/${id}/promote`);
  return data;
};