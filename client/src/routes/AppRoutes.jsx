//# react-router setup

import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Layout from '../components/Layout/Layout';

// Lazy loading components for better performance
const Home = lazy(() => import('../pages/HomePage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductPage = lazy(() => import('../pages/ProductPage'));
const Login = lazy(() => import('../pages/LoginPage'));
const Register = lazy(() => import('../pages/RegisterPage'));
const Cart = lazy(() => import('../pages/CartPage'));
const Checkout = lazy(() => import('../pages/CheckoutPage'));
const Profile = lazy(() => import('../pages/ProfilePage'));
const OrderHistory = lazy(() => import('../pages/OrderHistoryPage'));
const OrderDetail = lazy(() => import('../pages/OrderPage'));
const Wishlist = lazy(() => import('../pages/WishlistPage'));
const NotFound = lazy(() => import('../pages/NotFound'));
const About = lazy(() => import('../pages/AboutPage'));
const Contact = lazy(() => import('../pages/ContactPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const RecentlyViewedPage = lazy(() => import('../pages/RecentlyViewedPage'));
const AddressFormPage = lazy(() => import('../pages/AddressFormPage'));
const ResetPassword = lazy(() => import('../pages/ResetPasswordPage'));
const PaymentSuccessPage= lazy(()=>import('../pages/PaymentSuccessPage'));

// Admin pages
const Dashboard = lazy(() => import('../pages/Admin/Dashboard'));
const ProductManagement = lazy(() => import('../pages/Admin/ProductsPage'));
const CategoryManagement = lazy(() => import('../pages/Admin/CategoriesPage'));
const VariantManagement = lazy(() => import('../pages/Admin/VariantsPage'));
const OrderManagement = lazy(() => import('../pages/Admin/OrdersPage'));
const UserManagement = lazy(() => import('../pages/Admin/UsersPage'));
const ReviewManagement = lazy(() => import('../pages/Admin/ReviewsPage'));
const AddressManagement = lazy(() => import('../pages/Admin/AddressesPage'));

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
        {/* Wrap all content routes with Layout */}
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/password-reset/:token" element={<ResetPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/recently-viewed" element={<RecentlyViewedPage />} />

          {/* Protected routes - require authentication */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/address/new" element={<AddressFormPage />} />
            <Route path="/address/edit" element={<AddressFormPage />} />
            <Route path="/payment/success/:orderId" element={<PaymentSuccessPage />} />
          </Route>

          {/* Admin routes - require admin role */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/variants" element={<VariantManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/reviews" element={<ReviewManagement />} />
            <Route path="/admin/addresses" element={<AddressManagement />} />
          </Route>

          {/* Catch all route for 404 */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
