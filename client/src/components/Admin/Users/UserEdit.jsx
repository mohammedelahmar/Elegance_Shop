import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Alert } from 'react-bootstrap'; // Import Alert
import RBButton from 'react-bootstrap/Button'; // Alias for Bootstrap Button
import PropTypes from 'prop-types';
import { updateUser } from '../../../api/user';
import { FaSave, FaTimes } from 'react-icons/fa'; // Import icons
import './UserForms.css'; // Import the new CSS file

const UserEdit = ({ user, show, onHide, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    Firstname: '',
    Lastname: '',
    email: '',
    phone_number: '',
    address: '',
    role: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        Firstname: user.Firstname || '',
        Lastname: user.Lastname || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        role: user.role || 'client',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Create a data object without password if it's empty
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await updateUser(user._id, updateData);
      onUserUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'client', label: 'Client' },
    { value: 'admin', label: 'Admin' },
    { value: 'superadmin', label: 'Super Admin' } // Added Super Admin example
  ];

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="lg" dialogClassName="user-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit User {user?.Firstname && user?.Lastname ? ` - ${user.Firstname} ${user.Lastname}` : ''}</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit} className="user-form">
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="formUserFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="Firstname"
                value={formData.Firstname}
                onChange={handleChange}
                required
                placeholder="Enter first name"
              />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="formUserLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="Lastname"
                value={formData.Lastname}
                onChange={handleChange}
                required
                placeholder="Enter last name"
              />
            </Form.Group>
          </Row>
          
          <Form.Group className="mb-3" controlId="formUserEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formUserPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number (optional)"
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formUserAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address (optional)"
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formUserRole">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formUserPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave empty to keep current password"
            />
            <Form.Text muted>
              Leave empty to keep the current password.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <RBButton variant="secondary" onClick={onHide} className="user-form-btn">
            <FaTimes className="me-2" /> Cancel
          </RBButton>
          <RBButton 
            type="submit" 
            variant="primary" 
            disabled={loading}
            className="user-form-btn"
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

UserEdit.propTypes = {
  user: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onUserUpdated: PropTypes.func.isRequired
};

export default UserEdit;