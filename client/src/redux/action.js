import axios from 'axios';

// Fetch products
export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: 'PRODUCT_LIST_REQUEST' });
  try {
    const { data } = await axios.get('/api/products');
    dispatch({ type: 'PRODUCT_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_LIST_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

// Get product details
export const getProductDetails = (id) => async (dispatch) => {
  dispatch({ type: 'PRODUCT_DETAILS_REQUEST' });
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({ type: 'PRODUCT_DETAILS_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ 
      type: 'PRODUCT_DETAILS_FAIL', 
      payload: error.response?.data?.message || error.message 
    });
  }
};

// Add to cart
export const addToCart = (product, quantity = 1) => async (dispatch, getState) => {
  dispatch({
    type: 'CART_ADD_ITEM',
    payload: {
      _id: product._id,
      name: product.name,
      image_url: product.image_url,
      price: product.price,
      quantity
    }
  });

  // Save to local storage
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// Remove from cart
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: 'CART_REMOVE_ITEM',
    payload: id
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};