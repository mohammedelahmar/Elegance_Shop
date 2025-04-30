import React, { useState, useEffect } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { FaUser } from 'react-icons/fa';

const ProfileForm = () => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    Firstname: '',
    Lastname: '',
    email: '',
    phone_number: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      setFormData({
        Firstname: currentUser.Firstname || '',
        Lastname: currentUser.Lastname || '',
        email: currentUser.email || '',
        phone_number: currentUser.phone_number || '',
        address: currentUser.address || ''
      });
    }
  }, [currentUser]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Input
        label="First Name"
        name="Firstname"
        value={formData.Firstname}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Last Name"
        name="Lastname"
        value={formData.Lastname}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        disabled // Email should not be editable
        helperText="Email cannot be changed"
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
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />
      
      <Button 
        type="submit"
        fullWidth
        isLoading={loading}
        icon={FaUser}
        variant="success"
      >
        Update Profile
      </Button>
    </Form>
  );
};

export default ProfileForm;