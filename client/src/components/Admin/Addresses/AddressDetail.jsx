import React from 'react';
import { Modal, Card, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { FaUser, FaMapMarkedAlt, FaPhoneAlt, FaEdit } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './AddressList.css';

const AddressDetail = ({ address, show, onHide, onEdit }) => {
  if (!address) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      dialogClassName="address-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Address Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col md={6} className="mb-3">
            <Card className="h-100 address-card">
              <Card.Header className="d-flex align-items-center">
                <FaUser className="me-2" /> User Information
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Name:</strong> {address.user ? 
                    `${address.user.Firstname || ''} ${address.user.Lastname || ''}` : 
                    'Unknown User'
                  }
                </ListGroup.Item>
                {address.user?.email && (
                  <ListGroup.Item>
                    <strong>Email:</strong> {address.user.email}
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <strong>Created:</strong> {formatDate(address.createdAt)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Last Updated:</strong> {formatDate(address.updatedAt)}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="h-100 address-card">
              <Card.Header className="d-flex align-items-center">
                <FaPhoneAlt className="me-2" /> Contact Information
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Phone Number:</strong> {address.phone_number}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Card className="address-card">
          <Card.Header className="d-flex align-items-center">
            <FaMapMarkedAlt className="me-2" /> Address Details
          </Card.Header>
          <Card.Body>
            <p className="mb-1"><strong>Street Address:</strong></p>
            <p className="border-bottom pb-2">{address.address}</p>
            
            <Row className="mb-3">
              <Col>
                <strong>City:</strong><br />
                {address.city}
              </Col>
              <Col>
                <strong>Postal Code:</strong><br />
                {address.postal_code}
              </Col>
            </Row>
            
            <p><strong>Country:</strong><br />
            {address.country}</p>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="primary"
          onClick={onEdit}
          style={{
            background: '#4a6bf5', 
            borderColor: '#4a6bf5'
          }}
        >
          <FaEdit className="me-1" /> Edit Address
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddressDetail.propTypes = {
  address: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default AddressDetail;