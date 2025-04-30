//# checks AuthContext
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="auth-loading">Checking authentication...</div>;
  }
  
  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;