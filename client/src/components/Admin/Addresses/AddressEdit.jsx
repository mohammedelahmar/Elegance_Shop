import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Alert } from 'react-bootstrap'; // Import Alert
import RBButton from 'react-bootstrap/Button'; // Renamed to avoid conflict
import PropTypes from 'prop-types';
import { updateAddress } from '../../../api/address';
import { getAllUsers } from '../../../api/user';
import { FaSave, FaTimes } from 'react-icons/fa'; // Added FaTimes for cancel
import './AddressForms.css'; // Import the new CSS file

const AddressEdit = ({ address, show, onHide, onAddressUpdated }) => {
  const [formData, setFormData] = useState({
    user: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    phone_number: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Added for success message

  useEffect(() => {
    if (address) {
      setFormData({
        user: address.user?._id || address.user || '',
        address: address.address || '',
        city: address.city || '',
        country: address.country || '',
        postal_code: address.postal_code || '',
        phone_number: address.phone_number || ''
      });
    }
  }, [address]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to load users. Please refresh and try again.');
      }
    };

    if (show) {
      fetchUsers();
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccessMessage(''); // Clear previous success message
      
      await updateAddress(address._id, formData);
      setSuccessMessage('Address updated successfully!'); // Set success message
      onAddressUpdated();
      // Optionally close modal after a short delay
      // setTimeout(() => onHide(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="lg" dialogClassName="address-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Address</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit} className="address-form">
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>} {/* Display success message */}
          
          <Form.Group className="mb-3" controlId="formAddressUser">
            <Form.Label>User</Form.Label>
            <Form.Select
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {`${user.Firstname || ''} ${user.Lastname || ''} (${user.email})`.trim()}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formAddressStreet">
            <Form.Label>Street Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="e.g., 123 Main St, Apt 4B"
            />
          </Form.Group>
          
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="formAddressCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="e.g., Springfield"
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formAddressPostalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
                placeholder="e.g., 90210"
              />
            </Form.Group>
          </Row>
          
          <Form.Group className="mb-3" controlId="formAddressCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="e.g., USA"
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formAddressPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="e.g., (555) 123-4567"
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <RBButton variant="secondary" onClick={onHide} className="address-form-btn">
            <FaTimes className="me-2" /> Cancel
          </RBButton>
          <RBButton 
            type="submit" 
            variant="primary" 
            disabled={loading}
            className="address-form-btn"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <><FaSave className="me-2" /> Save Changes</>
            )}
          </RBButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

AddressEdit.propTypes = {
  address: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onAddressUpdated: PropTypes.func.isRequired
};

export default AddressEdit;