const API_URL = 'http://localhost:5000/api';

export const fetchWithToken = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user.token;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  return response;
};

export const getProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/products${queryParams ? `?${queryParams}` : ''}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Add more API methods as needed