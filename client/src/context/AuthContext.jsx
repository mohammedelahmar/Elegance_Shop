import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../api/auth';
import { getUserProfile, updateUserProfile } from '../api/user';

// Create context
const AuthContext = createContext();

// Custom hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const loadUserFromToken = async () => {
      if (token) {
        try {
          const userData = await getUserProfile();
          setCurrentUser(userData);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          // If token is invalid, clear it
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserFromToken();
  }, [token]);

  // Register new user
  const register = async (userData) => {
    setError(null);
    try {
      const data = await registerApi(userData);
      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem('userToken', data.token);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginApi(email, password);
      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem('userToken', data.token);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('userToken');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setError(null);
    try {
      const updatedUser = await updateUserProfile(userData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  // Context value
  const value = {
    currentUser,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    isAdmin: isAdmin(),
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;