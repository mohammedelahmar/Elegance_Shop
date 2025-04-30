import axios from './axios';

/**
 * Add a new address
 * @param {Object} addressData - Address details
 * @returns {Promise} - Promise with created address
 */
export const addAddress = async (addressData) => {
  const { data } = await axios.post('/addresses', addressData);
  return data;
};

/**
 * Get address by ID
 * @param {string} id - Address ID
 * @returns {Promise} - Promise with address details
 */
export const getAddressById = async (id) => {
  const { data } = await axios.get(`/addresses/${id}`);
  return data;
};

/**
 * Update an address
 * @param {string} id - Address ID
 * @param {Object} addressData - Address data to update
 * @returns {Promise} - Promise with updated address
 */
export const updateAddress = async (id, addressData) => {
  const { data } = await axios.put(`/addresses/${id}`, addressData);
  return data;
};

/**
 * Delete an address
 * @param {string} id - Address ID
 * @returns {Promise} - Promise with success message
 */
export const deleteAddress = async (id) => {
  const { data } = await axios.delete(`/addresses/${id}`);
  return data;
};

/**
 * Get all addresses (admin only)
 * @returns {Promise} - Promise with all addresses
 */
export const getAllAddresses = async () => {
  const { data } = await axios.get('/addresses');
  return data;
};