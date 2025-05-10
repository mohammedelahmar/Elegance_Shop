import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { FaLock } from 'react-icons/fa';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const data = await resetPassword(token, password);
      setSuccess(data.message || 'Password reset successful!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <div className="text-center mb-4">
        <FaLock size={40} className="text-primary mb-2" />
        <h2>Reset Password</h2>
        <p className="text-muted">Enter your new password</p>
      </div>
      
      <Input
        label="New Password"
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      
      <Button 
        type="submit" 
        fullWidth 
        isLoading={loading}
        icon={FaLock}
      >
        Reset Password
      </Button>
      
      <div className="mt-3 text-center">
        <Link to="/login">Back to Login</Link>
      </div>
    </Form>
  );
};

export default ResetPasswordForm;