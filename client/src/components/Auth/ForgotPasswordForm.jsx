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
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <div className="text-center mb-4">
        <FaKey size={40} className="text-primary mb-2" />
        <h2>Forgot Password</h2>
        <p className="text-muted">Enter your email to receive a password reset link</p>
      </div>
      
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Button 
        type="submit" 
        fullWidth 
        isLoading={loading}
        icon={FaKey}
      >
        Send Reset Link
      </Button>
      
      <div className="mt-3 text-center">
        <Link to="/login">Back to Login</Link>
      </div>
    </Form>
  );
};

export default ForgotPasswordForm;