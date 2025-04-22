import { getToken } from './authService';

const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Add authorization token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`/api${endpoint}`, config);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'An error occurred');
    }
    
    return result;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const api = {
  // Auth endpoints
  login: (credentials) => apiRequest('/users/login', 'POST', credentials),
  register: (userData) => apiRequest('/users/register', 'POST', userData),
  getProfile: () => apiRequest('/users/profile'),
  
  // Product endpoints
  getProducts: () => apiRequest('/products'),
  getProductById: (id) => apiRequest(`/products/${id}`),
  
  // Cart endpoints
  getCart: () => apiRequest('/cart'),
  addToCart: (productData) => apiRequest('/cart', 'POST', productData),
  updateCartItem: (id, quantity) => apiRequest(`/cart/${id}`, 'PUT', { quantity }),
  removeFromCart: (id) => apiRequest(`/cart/${id}`, 'DELETE'),
  clearCart: () => apiRequest('/cart', 'DELETE'),
  
  // Order endpoints
  createOrder: (orderData) => apiRequest('/commandes', 'POST', orderData),
  processPayment: (paymentData) => apiRequest('/payment', 'POST', paymentData)
};