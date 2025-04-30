import { createContext, useState, useContext, useEffect } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist';
import { useAuth } from './AuthContext';

// Create context
const WishlistContext = createContext();

// Custom hook for using the wishlist context
export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      // Clear wishlist when user logs out
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  // Fetch wishlist items from API
  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getWishlist();
      // Handle the API response correctly - it returns products array
      setWishlistItems(data.products || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch wishlist');
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addItem = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to add items to wishlist');
    }
    
    setError(null);
    try {
      const data = await addToWishlist(productId);
      // Update wishlist items with the returned data
      setWishlistItems(data.products || []);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add item to wishlist');
      throw error;
    }
  };

  // Remove item from wishlist
  const removeItem = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to remove items from wishlist');
    }
    
    setError(null);
    try {
      const data = await removeFromWishlist(productId);
      // Update wishlist items with the returned data
      setWishlistItems(data.products || []);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove item from wishlist');
      throw error;
    }
  };

  // Toggle item in wishlist (add if not exists, remove if exists)
  const toggleItem = async (productId) => {
    if (isInWishlist(productId)) {
      return removeItem(productId);
    } else {
      return addItem(productId);
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  // Context value
  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    error,
    fetchWishlist,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;