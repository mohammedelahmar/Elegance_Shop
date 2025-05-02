import axios from './axios';

/**
 * Create a new order
 * @param {Object} orderData - Order details
 * @returns {Promise} - Promise with created order
 */
export const createOrder = async (orderData) => {
  const { data } = await axios.post('/orders', orderData);
  return data;
};

/**
 * Get order by ID
 * @param {string} id - Order ID
 * @returns {Promise} - Promise with order details
 */
export const getOrderById = async (id) => {
  const { data } = await axios.get(`/orders/${id}`);
  return data;
};

/**
 * Get current user's orders
 * @returns {Promise} - Promise with list of user's orders
 */
export const getMyOrders = async () => {
  const { data } = await axios.get('/orders/myorders');
  return data;
};

/**
 * Get all orders (admin only)
 * @returns {Promise} - Promise with all orders
 */
export const getAllOrders = async () => {
  const { data } = await axios.get('/orders');
  return data;
};

/**
 * Update order to paid status manually (admin only)
 * @param {string} id - Order ID
 * @param {Object} paymentResult - Payment result details
 * @returns {Promise} - Promise with updated order
 */
export const updateOrderToPaid = async (id, paymentResult) => {
  const { data } = await axios.put(`/orders/${id}/pay`, paymentResult);
  return data;
};

/**
 * Update order to delivered status (admin only)
 * @param {string} id - Order ID
 * @returns {Promise} - Promise with updated order
 */
export const updateOrderToDelivered = async (id) => {
  const { data } = await axios.put(`/orders/${id}/deliver`);
  return data;
};