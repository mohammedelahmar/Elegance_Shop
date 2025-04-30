//# checks user.role === 'admin'

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoute component
 * Protects routes that require admin privileges
 * Redirects to home page if user is not an admin
 */
const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading, currentUser } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="auth-loading">Checking authentication...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated but not admin, redirect to home page
  if (!isAdmin) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          message: "Access denied: Admin privileges required",
          severity: "error" 
        }} 
        replace 
      />
    );
  }
  
  // If authenticated and admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;