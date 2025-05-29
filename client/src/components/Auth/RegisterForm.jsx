import React, { useState } from 'react';
import { Form, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { FaUserPlus } from 'react-icons/fa';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    Firstname: '',
    Lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    address: '',
    sexe: 'male'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword as it's not needed for API
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];
  return (
    <div className="auth-form">
      <Form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="danger" className="auth-alert alert-danger">
            {error}
          </Alert>
        )}
        
        <Row>
          <Col md={6}>
            <Input
              label="First Name"
              name="Firstname"
              placeholder="Enter your first name"
              value={formData.Firstname}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </Col>
          <Col md={6}>
            <Input
              label="Last Name"
              name="Lastname"
              placeholder="Enter your last name"
              value={formData.Lastname}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </Col>
        </Row>

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="auth-input"
        />
        
        <Input
          label="Phone Number"
          type="tel"
          name="phone_number"
          placeholder="Enter your phone number"
          value={formData.phone_number}
          onChange={handleChange}
          required
          className="auth-input"
        />
        
        <Input
          label="Gender"
          as="select"
          name="sexe"
          value={formData.sexe}
          onChange={handleChange}
          options={genderOptions}
          className="auth-input"
        />
        
        <Input
          label="Address"
          name="address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={handleChange}
          required
          className="auth-input"
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
          className="auth-input"
        />
        
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
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
              Creating Account...
            </div>
          ) : (
            <>
              <FaUserPlus className="me-2" />
              Create Account
            </>
          )}
        </Button>
      </Form>
      
      <div className="auth-links">
        <div className="register-link">
          Already have an account?{' '}
          <Link to="/login" className="auth-link primary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;