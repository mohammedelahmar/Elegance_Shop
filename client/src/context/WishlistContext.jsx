import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist as apiClearWishlist } from '../api/wishlist';
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

  // Use useCallback to memoize the fetchWishlist function
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getWishlist();
      console.log("Wishlist data:", data); // Debug log
      
      // Check if data is populated correctly
      if (data && data.products && Array.isArray(data.products)) {
        setWishlistItems(data.products);
      } else if (data && Array.isArray(data)) {
        setWishlistItems(data);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError(error.response?.data?.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]); // Only depend on isAuthenticated

  // Fetch wishlist when user authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, fetchWishlist]);

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

  // Also update the isInWishlist function to handle possible structure differences
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => 
      (item._id === productId) || 
      (item.product && item.product._id === productId)
    );
  };

  // Add this function to your provider
  const clearWishlist = async () => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to clear your wishlist');
    }
    
    setError(null);
    try {
      const data = await apiClearWishlist();
      setWishlistItems([]);
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to clear wishlist');
      throw error;
    }
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
    isInWishlist,
    clearWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;