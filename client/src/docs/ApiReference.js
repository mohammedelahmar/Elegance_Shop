/**
 * API Reference Documentation
 * Base URL: http://localhost:5000/api
 * 
 * This file contains documentation for all available API endpoints.
 * Use this as a reference when working with the backend services.
 */

const ApiReference = {
  baseUrl: 'http://localhost:5000/api',
  authentication: `
    All protected routes require a JWT token.
    Include token in the Authorization header:
    Authorization: Bearer <your_token>
    Get your token by logging in via /api/users/login
  `,
  
  endpoints: {
    users: {
      register: {
        url: '/users/register',
        method: 'POST',
        authRequired: false,
        description: 'Register a new user',
        body: {
          Firstname: 'String',
          Lastname: 'String',
          sexe: 'String',
          email: 'String',
          password: 'String',
          phone_number: 'String',
          address: 'String'
        }
      },
      login: {
        url: '/users/login',
        method: 'POST',
        authRequired: false,
        description: 'Login user and get token',
        body: {
          email: 'String',
          password: 'String'
        }
      },
      // Add more user endpoints...
    },
    
    products: {
      getAll: {
        url: '/products',
        method: 'GET',
        authRequired: false,
        description: 'Get all products with filtering options',
        queryParams: {
          keyword: 'Search term',
          category: 'Filter by category',
          page: 'Page number',
          limit: 'Items per page'
        }
      },
      // Add more product endpoints...
    },
    
    // Add more endpoint categories...
  }
};

export default ApiReference;