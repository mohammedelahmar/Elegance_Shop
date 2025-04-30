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
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Input
        label="Password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <Button 
        type="submit" 
        fullWidth 
        isLoading={loading}
        icon={FaSignInAlt}
      >
        Login
      </Button>
      
      <div className="mt-3 text-center">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </Form>
  );
};

export default LoginForm;