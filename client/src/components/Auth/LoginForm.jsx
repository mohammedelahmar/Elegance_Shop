import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { FaSignInAlt } from 'react-icons/fa';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <Form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="danger" className="auth-alert alert-danger">
            {error}
          </Alert>
        )}
        
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        
        <div className="forgot-password-link">
          <Link to="/forgot-password" className="auth-link">
            Forgot Password?
          </Link>
        </div>
        
        <Button 
          type="submit" 
          className="auth-btn"
          disabled={loading}
        >
          {loading ? (
            <div className="auth-loading">
              <span className="auth-spinner"></span>
              Signing In...
            </div>
          ) : (
            <>
              <FaSignInAlt className="me-2" />
              Sign In
            </>
          )}
        </Button>
      </Form>
      
      <div className="auth-links">
        <div className="register-link">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link primary">          Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;