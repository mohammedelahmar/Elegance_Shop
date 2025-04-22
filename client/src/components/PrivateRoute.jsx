import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;