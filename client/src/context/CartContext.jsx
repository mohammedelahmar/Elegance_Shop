import { createContext, useState, useContext, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../api/cart';
import { useAuth } from './AuthContext';

// Create context
const CartContext = createContext();

// Custom hook for using the cart context
export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Calculate derived values
  const itemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // FIX: Safely calculate subtotal by checking if product_id exists and has price
  const subtotal = cartItems.reduce(
    (total, item) => {
      // Handle MongoDB Decimal128 price format or regular price
      const price = item.product_id ? 
        (typeof item.product_id.price === 'object' && item.product_id.price.$numberDecimal ? 
          parseFloat(item.product_id.price.$numberDecimal) : 
          (parseFloat(item.product_id.price) || 0)) : 
        0;
      
      return total + price * item.quantity;
    }, 
    0
  );

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [isAuthenticated]);

  // Fetch cart items from API
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCartItems(data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addItem = async (productId, quantity = 1, variantId = null) => {
    setError(null);
    try {
      const data = await addToCart(productId, quantity, variantId);
      // Fetch the updated cart after adding an item
      await fetchCart();
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add item to cart');
      throw error;
    }
  };

  // Update item quantity
  const updateItemQuantity = async (itemId, quantity) => {
    setError(null);
    try {
      const data = await updateCartItem(itemId, quantity);
      // Fetch the updated cart after updating an item
      await fetchCart();
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update item');
      throw error;
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    setError(null);
    try {
      const data = await removeFromCart(itemId);
      // Fetch the updated cart after removing an item
      await fetchCart();
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove item');
      throw error;
    }
  };

  // Clear cart
  const clearCart = async () => {
    // This would typically be implemented on the backend
    // For now, we'll just remove each item
    setError(null);
    try {
      for (const item of cartItems) {
        await removeFromCart(item._id);
      }
      setCartItems([]);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to clear cart');
      throw error;
    }
  };

  // Check if a product is in the cart
  const isInCart = (productId, variantId = null) => {
    return cartItems.some(item => {
      if (variantId) {
        return item.product_id?._id === productId && item.variant_id === variantId;
      }
      return item.product_id?._id === productId;
    });
  };

  // Context value
  const value = {
    cartItems,
    loading,
    error,
    itemsCount,
    subtotal,
    fetchCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;