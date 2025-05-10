import { useState, useEffect } from 'react';

const MAX_RECENTLY_VIEWED = 8; // Maximum number of products to store

const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load recently viewed products from localStorage on initial render
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('recentlyViewedProducts');
      if (storedProducts) {
        setRecentlyViewed(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
    }
  }, []);

  // Add a product to recently viewed
  const addProduct = (product) => {
    if (!product || !product._id) return;
    
    setRecentlyViewed(prev => {
      // Remove the product if it's already in the list
      const filtered = prev.filter(p => p._id !== product._id);
      
      // Add product to the beginning of the array
      const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      
      // Save to localStorage
      try {
        localStorage.setItem('recentlyViewedProducts', JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recently viewed products:', error);
      }
      
      return updated;
    });
  };

  // Clear recently viewed products
  const clearRecentlyViewed = () => {
    localStorage.removeItem('recentlyViewedProducts');
    setRecentlyViewed([]);
  };

  return { recentlyViewed, addProduct, clearRecentlyViewed };
};

export default useRecentlyViewed;