import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { FaKey } from 'react-icons/fa';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const data = await forgotPassword(email);
      setSuccess(data.message || 'Password reset email sent! Please check your inbox.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
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
        {success && (
          <Alert variant="success" className="auth-alert alert-success">
            {success}
          </Alert>
        )}
        
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />
        
        <Button 
          type="submit" 
          className="auth-btn"
          disabled={loading}
        >
          {loading ? (
            <div className="auth-loading">
              <span className="auth-spinner"></span>
              Sending Reset Link...
            </div>
          ) : (
            <>
              <FaKey className="me-2" />
              Send Reset Link
            </>
          )}
        </Button>
      </Form>
      
      <div className="auth-links">
        <div className="register-link">
          Remember your password?{' '}
          <Link to="/login" className="auth-link primary">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;