import axios from 'axios';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Request interceptor to add auth token to requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    // You could use this for global error handling
    return Promise.reject(error);
  }
);

export default instance;
