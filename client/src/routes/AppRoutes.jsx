//# react-router setup

import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Lazy loading components for better performance
const Home = lazy(() => import('../pages/HomePage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage')); // Fixed import
const ProductPage = lazy(() => import('../pages/ProductPage')); // Fixed import
const Login = lazy(() => import('../pages/LoginPage'));
const Register = lazy(() => import('../pages/RegisterPage'));
const Cart = lazy(() => import('../pages/CartPage'));
const Checkout = lazy(() => import('../pages/CheckoutPage'));
const Profile = lazy(() => import('../pages/ProfilePage'));
const OrderHistory = lazy(() => import('../pages/OrderHistoryPage'));
const OrderDetail = lazy(() => import('../pages/OrderPage'));
const Wishlist = lazy(() => import('../pages/WishlistPage'));
// const NotFound = lazy(() => import('../pages/NotFound'));

// Admin pages
// const Dashboard = lazy(() => import('../pages/admin/'));
// const ProductManagement = lazy(() => import('../pages/admin/ProductManagement'));
// const CategoryManagement = lazy(() => import('../pages/admin/CategoryManagement'));
// const OrderManagement = lazy(() => import('../pages/admin/OrderManagement'));
// const UserManagement = lazy(() => import('../pages/admin/UserManagement'));

const LoadingFallback = () => (
  <div className="page-loader">
    <div className="loader-spinner"></div>
    <p>Loading...</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} /> {/* Updated component name */}
        <Route path="/products/:id" element={<ProductPage />} /> {/* Updated component name */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes - require authentication */}
        <Route element={<PrivateRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
        
        {/* Admin routes - require admin role */}
        {/* <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route> */}
        
        {/* Catch all route for 404 */}
        {/* <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} /> */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
