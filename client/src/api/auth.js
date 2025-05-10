//# login, register

import axios from './axios';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with user data and token
 */
export const register = async (userData) => {
  const { data } = await axios.post('/users/register', userData);
  return data;
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data and token
 */
export const login = async (email, password) => {
  const { data } = await axios.post('/users/login', { email, password });
  return data;
};

/**
 * Request password reset
 * @param {string} email - User's email address
 * @returns {Promise} - Promise with reset token data
 */
export const forgotPasswordApi = async (email) => {
  const { data } = await axios.post('/password/forgot', { email });
  return data;
};

/**
 * Reset password with token
 * @param {string} token - Reset token from email
 * @param {string} password - New password
 * @returns {Promise} - Promise with reset confirmation
 */
export const resetPasswordApi = async (token, password) => {
  const { data } = await axios.put(`/password/reset/${token}`, { password });
  return data;
};