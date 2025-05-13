import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaLock, FaCreditCard } from 'react-icons/fa';

const CreditCardModal = ({ show, onHide, amount, onSubmit, loading }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!cardData.cardNumber.trim() || cardData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter the cardholder name';
    }
    
    if (!cardData.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!cardData.cvv.trim() || !/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(cardData);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Complete payment with Credit Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-4">Total amount: <strong>${amount.toFixed(2)}</strong></p>
        
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Processing your payment...</p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleChange}
                maxLength="19"
                isInvalid={!!errors.cardNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cardNumber}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John Smith"
                name="cardholderName"
                value={cardData.cardholderName}
                onChange={handleChange}
                isInvalid={!!errors.cardholderName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cardholderName}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleChange}
                    maxLength="5"
                    isInvalid={!!errors.expiryDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.expiryDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="123"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleChange}
                    maxLength="4"
                    isInvalid={!!errors.cvv}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cvv}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-grid mt-4">
              <Button variant="primary" type="submit" disabled={loading}>
                <FaLock className="me-2" />
                Pay Now
              </Button>
            </div>
            
            <div className="text-center mt-3">
              <small className="text-muted">
                <FaLock size={12} className="me-1" />
                Your payment information is secure
              </small>
            </div>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="outline-secondary" 
          onClick={() => {
            if (window.confirm("Are you sure you want to cancel this payment? Your order will remain unpaid.")) {
              onHide();
            }
          }}
          disabled={loading}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreditCardModal;