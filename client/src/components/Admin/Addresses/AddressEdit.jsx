import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { updateAddress } from '../../../api/address';
import { getAllUsers } from '../../../api/user';
import { FaSave } from 'react-icons/fa';

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
      
      await updateAddress(address._id, formData);
      onAddressUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Address</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Input
            label="User"
            as="select"
            name="user"
            value={formData.user}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Select User' },
              ...users.map(user => ({
                value: user._id,
                label: `${user.Firstname} ${user.Lastname} (${user.email})`
              }))
            ]}
          />
          
          <Input
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            as="textarea"
            rows={2}
          />
          
          <Row>
            <Col md={6}>
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={6}>
              <Input
                label="Postal Code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            icon={FaSave}
            loading={loading}
          >
            Save Changes
          </Button>
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