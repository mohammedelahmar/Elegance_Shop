import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaShoppingBag, FaReceipt } from 'react-icons/fa';

const PaymentSuccessPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const paymentMethod = searchParams.get('method') || 'paypal';

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // You could add analytics tracking here
    console.log(`Payment success tracked for order: ${orderId}`);
  }, [orderId]);

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
              <Card.Body className="p-5 text-center">
                <div className="mb-4">
                  <div className="success-checkmark">
                    <div className="check-icon">
                      <span className="icon-line line-tip"></span>
                      <span className="icon-line line-long"></span>
                      <div className="icon-circle"></div>
                      <div className="icon-fix"></div>
                    </div>
                  </div>
                  <FaCheck className="text-success" style={{ fontSize: '3rem' }} />
                </div>
                
                <h1 className="display-6 mb-3">
                  {paymentMethod === 'cod' ? 'Order Confirmed!' : 'Payment Successful!'}
                </h1>
                <p className="lead mb-4">
                  {paymentMethod === 'cod' 
                    ? 'Thank you for your order. Your items will be prepared for delivery and payment will be collected upon delivery.'
                    : paymentMethod === 'bank_transfer'
                      ? 'Thank you for your order. Please complete the bank transfer using the provided account details.'
                      : 'Thank you for your purchase. Your order has been confirmed and will be processed shortly.'}
                </p>
                
                <div className="payment-details mb-4">
                  <p className="mb-1">
                    <strong>Order ID:</strong> {orderId && `#${orderId.slice(-6)}`}
                  </p>
                  <p className="mb-1">
                    <strong>Payment Method:</strong> {
                      paymentMethod === 'paypal' ? 'PayPal' : 
                      paymentMethod === 'cod' ? 'Cash on Delivery' : 
                      paymentMethod === 'credit_card' ? 'Credit Card' : 
                      'Bank Transfer'
                    }
                  </p>
                </div>
                
                <div className="d-grid gap-3">
                  <Link to={`/order/${orderId}`} className="text-decoration-none">
                    <Button variant="primary" size="lg" className="w-100">
                      <FaReceipt className="me-2" /> View Order Details
                    </Button>
                  </Link>
                  
                  <Link to="/shop" className="text-decoration-none">
                    <Button variant="outline-primary" size="lg" className="w-100">
                      <FaShoppingBag className="me-2" /> Continue Shopping
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

export default PaymentSuccessPage;