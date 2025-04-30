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