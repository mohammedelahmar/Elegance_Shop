import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
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
  );
}

export default App;