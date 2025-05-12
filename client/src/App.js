import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  // Make sure you have a valid PayPal client ID in your .env file
  const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  
  return (
    <PayPalScriptProvider 
      options={{
        "client-id": paypalClientId,
        currency: "USD",
        intent: "capture",
        components: "buttons",
        disableFunding: "",  // Remove restrictions
        debug: process.env.NODE_ENV === 'development'  // Enable debug in development
      }}
    >
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Provider store={store}>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </Provider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </PayPalScriptProvider>
  );
}

export default App;