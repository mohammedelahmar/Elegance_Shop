import axios from './axios';

/**
 * Process payment
 * @param {Object} paymentData - Payment details
 * @returns {Promise} - Promise with payment confirmation
 */
export const processPayment = async (paymentData) => {
  const { data } = await axios.post('/payment', paymentData);
  return data;
};

/**
 * Get payment status
 * @param {string} paymentId - Payment ID
 * @returns {Promise} - Promise with payment status
 */
export const getPaymentStatus = async (paymentId) => {
  const { data } = await axios.get(`/payment/${paymentId}`);
  return data;
};