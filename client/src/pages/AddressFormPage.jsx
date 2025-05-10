import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaCity, FaGlobe, FaPhone, FaHome } from 'react-icons/fa';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import Message from '../components/UI/Message';
import { useAuth } from '../context/AuthContext';
import { ProfileInput } from '../components/Auth/ProfileInput';

const AddressFormPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const addressId = queryParams.get('id');
  const isEditMode = Boolean(addressId);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    country: '',
    postal_code: '',
    phone_number: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch address details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const getAddress = async () => {
        try {
          setFetchingAddress(true);
          const { data } = await axios.get(`/addresses/${addressId}`);
          setFormData({
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            postal_code: data.postal_code || '',
            phone_number: data.phone_number || ''
          });
        } catch (error) {
          setError(error.response?.data?.message || 'Failed to load address details');
        } finally {
          setFetchingAddress(false);
        }
      };
      
      getAddress();
    }
  }, [addressId, isEditMode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isEditMode) {
        await axios.put(`/addresses/${addressId}`, formData);
        setSuccess('Address updated successfully');
      } else {
        await axios.post('/addresses', formData);
        setSuccess('Address added successfully');
        // Reset form after successful creation
        setFormData({
          address: '',
          city: '',
          country: '',
          postal_code: '',
          phone_number: ''
        });
      }
      
      // After a brief delay, navigate back to profile
      setTimeout(() => {
        navigate('/profile', { state: { activeTab: 'addresses' } });
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} address`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    navigate('/login?redirect=address');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="address-form-page py-5"
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="mb-4">
              <Button 
                as={Link} 
                to="/profile" 
                state={{ activeTab: 'addresses' }} 
                variant="link" 
                className="text-decoration-none ps-0"
              >
                <FaArrowLeft className="me-2" /> Back to Profile
              </Button>
            </div>

            <Card className="address-form-card border-0 shadow-sm">
              <Card.Body className="p-4">
                <h2 className="mb-4 text-center">
                  {isEditMode ? 'Edit Address' : 'Add New Address'}
                </h2>

                {error && <Message variant="danger">{error}</Message>}
                {success && <Message variant="success">{success}</Message>}

                {fetchingAddress ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading address details...</p>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <ProfileInput
                      label="Street Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your street address"
                      required
                      icon={FaHome}
                    />
                    
                    <Row>
                      <Col md={6}>
                        <ProfileInput
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Enter city"
                          required
                          icon={FaCity}
                        />
                      </Col>
                      <Col md={6}>
                        <ProfileInput
                          label="Postal Code"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleChange}
                          placeholder="Enter postal code"
                          required
                          icon={FaMapMarkerAlt}
                        />
                      </Col>
                    </Row>
                    
                    <ProfileInput
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter country"
                      required
                      icon={FaGlobe}
                    />
                    
                    <ProfileInput
                      label="Phone Number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                      icon={FaPhone}
                    />
                    
                    <div className="d-grid gap-2 mt-4">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading}
                        className="py-2"
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            {isEditMode ? 'Updating...' : 'Adding...'}
                          </>
                        ) : (
                          isEditMode ? 'Update Address' : 'Add Address'
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default AddressFormPage;