import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Create reducers (we'll start with product reducer)
const productListInitialState = { loading: false, products: [], error: null };
const productListReducer = (state = productListInitialState, action) => {
  switch (action.type) {
    case 'PRODUCT_LIST_REQUEST':
      return { ...state, loading: true };
    case 'PRODUCT_LIST_SUCCESS':
      return { loading: false, products: action.payload, error: null };
    case 'PRODUCT_LIST_FAIL':
      return { loading: false, products: [], error: action.payload };
    default:
      return state;
  }
};

const productDetailsInitialState = { loading: false, product: null, error: null };
const productDetailsReducer = (state = productDetailsInitialState, action) => {
  switch (action.type) {
    case 'PRODUCT_DETAILS_REQUEST':
      return { ...state, loading: true };
    case 'PRODUCT_DETAILS_SUCCESS':
      return { loading: false, product: action.payload, error: null };
    case 'PRODUCT_DETAILS_FAIL':
      return { loading: false, product: null, error: action.payload };
    default:
      return state;
  }
};

const cartInitialState = { cartItems: [] };
const cartReducer = (state = cartInitialState, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      return { 
        ...state, 
        cartItems: [...state.cartItems, action.payload] 
      };
    case 'CART_REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item._id !== action.payload)
      };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer
  },
});

export default store;