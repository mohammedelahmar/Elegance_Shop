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
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={6}>
          <Input
            label="First Name"
            name="Firstname"
            value={formData.Firstname}
            onChange={handleChange}
            required
          />
        </Col>
        <Col md={6}>
          <Input
            label="Last Name"
            name="Lastname"
            value={formData.Lastname}
            onChange={handleChange}
            required
          />
        </Col>
      </Row>
      
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Phone Number"
        type="tel"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Gender"
        as="select"
        name="sexe"
        value={formData.sexe}
        onChange={handleChange}
        options={genderOptions}
      />
      
      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      
      <Button 
        type="submit" 
        fullWidth 
        isLoading={loading}
        icon={FaUserPlus}
      >
        Register
      </Button>
      
      <div className="mt-3 text-center">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </Form>
  );
};

export default RegisterForm;