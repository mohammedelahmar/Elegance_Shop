import React, { useState, useEffect } from 'react';
import { Form, Alert, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ProfileInput, ProfileTextarea } from './ProfileInput';
import Button from '../UI/Button';
import { FaUser, FaSave, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

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
    // Clear messages when form changes
    if (success) setSuccess('');
    if (error) setError('');
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
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert 
            variant="danger" 
            dismissible 
            onClose={() => setError('')}
            className="mb-4"
          >
            {error}
          </Alert>
        </motion.div>
      )}
      
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert 
            variant="success" 
            dismissible 
            onClose={() => setSuccess('')}
            className="mb-4"
          >
            <div className="d-flex align-items-center">
              <div className="me-2">✓</div> {success}
            </div>
          </Alert>
        </motion.div>
      )}
      
      <h3 className="form-section-header">Personal Information</h3>
      
      <Row>
        <Col md={6}>
          <ProfileInput
            label="First Name"
            name="Firstname"
            value={formData.Firstname}
            onChange={handleChange}
            required
            icon={FaUser}
          />
        </Col>
        
        <Col md={6}>
          <ProfileInput
            label="Last Name"
            name="Lastname"
            value={formData.Lastname}
            onChange={handleChange}
            required
            icon={FaUser}
          />
        </Col>
      </Row>
      
      <ProfileInput
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        disabled
        icon={FaEnvelope}
        helperText="Email cannot be changed for security reasons"
      />
      
      <ProfileInput
        label="Phone Number"
        type="tel"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        required
        icon={FaPhone}
      />
      
      <ProfileTextarea
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        icon={FaMapMarkerAlt}
        placeholder="Enter your full address"
      />
      
      <div className="d-flex justify-content-end mt-4">
        <Button 
          type="submit"
          isLoading={loading}
          className="update-profile-btn"
        >
          <FaSave className="me-2" /> Update Profile
        </Button>
      </div>
    </Form>
  );
};

export default ProfileForm;