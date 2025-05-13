import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaUniversity, FaCopy, FaReceipt, FaShoppingBag } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BankTransferPage = () => {
  const { orderId } = useParams();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <FaUniversity className="text-primary" style={{ fontSize: '3rem' }} />
                  <h1 className="mt-3">Bank Transfer Instructions</h1>
                  <p className="lead">
                    Please complete your payment by transferring the funds to our bank account.
                  </p>
                </div>

                <Alert variant="info">
                  Your order has been placed successfully, but payment is pending until we receive your bank transfer.
                </Alert>

                <Card className="mb-4 bg-light">
                  <Card.Body>
                    <h5>Order Information</h5>
                    <p className="mb-1">
                      <strong>Order ID:</strong> #{orderId.slice(-6)}
                    </p>
                  </Card.Body>
                </Card>

                <Card className="mb-4">
                  <Card.Body>
                    <h5 className="mb-3">Bank Account Details</h5>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Bank Name:</span>
                      <div className="d-flex">
                        <span className="me-2 fw-bold">YOUR BANK NAME</span>
                        <button 
                          className="btn btn-sm"
                          onClick={() => copyToClipboard('YOUR BANK NAME')}
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Account Name:</span>
                      <div className="d-flex">
                        <span className="me-2 fw-bold">YOUR COMPANY NAME</span>
                        <button 
                          className="btn btn-sm"
                          onClick={() => copyToClipboard('YOUR COMPANY NAME')}
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Account Number:</span>
                      <div className="d-flex">
                        <span className="me-2 fw-bold">123456789</span>
                        <button 
                          className="btn btn-sm"
                          onClick={() => copyToClipboard('123456789')}
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>IBAN:</span>
                      <div className="d-flex">
                        <span className="me-2 fw-bold">XX00 0000 0000 0000 0000 0000</span>
                        <button 
                          className="btn btn-sm"
                          onClick={() => copyToClipboard('XX00 0000 0000 0000 0000 0000')}
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Reference:</span>
                      <div className="d-flex">
                        <span className="me-2 fw-bold">ORDER-{orderId.slice(-6)}</span>
                        <button 
                          className="btn btn-sm"
                          onClick={() => copyToClipboard(`ORDER-${orderId.slice(-6)}`)}
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                
                <div className="alert alert-warning">
                  <h6 className="alert-heading fw-bold">Important!</h6>
                  <p className="mb-0">Please include your Order ID as a reference when making the payment. Your order will be processed after we confirm your transfer.</p>
                </div>

                <div className="d-grid gap-3 mt-4">
                  <Link to={`/order/${orderId}`}>
                    <Button variant="primary" className="w-100">
                      <FaReceipt className="me-2" />View Order Details
                    </Button>
                  </Link>
                  
                  <Link to="/shop">
                    <Button variant="outline-primary" className="w-100">
                      <FaShoppingBag className="me-2" />Continue Shopping
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default BankTransferPage;