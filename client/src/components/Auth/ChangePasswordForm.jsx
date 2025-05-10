import React, { useState } from 'react';
import { Form, Alert, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axios from '../../api/axios';
import { ProfileInput } from './ProfileInput';
import Button from '../UI/Button';
import { FaLock, FaSave } from 'react-icons/fa';

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear messages when form changes
    if (success) setSuccess('');
    if (error) setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    // Validate password length
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await axios.put('/users/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setSuccess('Password updated successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
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
      
      <h3 className="form-section-header">Change Your Password</h3>
      <p className="text-white-50 mb-4">
        To change your password, please enter your current password followed by your new password.
      </p>
      
      <ProfileInput
        label="Current Password"
        type="password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleChange}
        required
        icon={FaLock}
        placeholder="Enter your current password"
      />
      
      <Row>
        <Col md={6}>
          <ProfileInput
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            icon={FaLock}
            placeholder="Enter new password"
            helperText="Password must be at least 6 characters long"
          />
        </Col>
        
        <Col md={6}>
          <ProfileInput
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon={FaLock}
            placeholder="Confirm new password"
          />
        </Col>
      </Row>
      
      <div className="d-flex justify-content-end mt-4">
        <Button 
          type="submit"
          isLoading={loading}
          className="change-password-btn"
        >
          <FaSave className="me-2" /> Update Password
        </Button>
      </div>
    </Form>
  );
};

export default ChangePasswordForm;