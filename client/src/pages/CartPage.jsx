import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartList from '../components/Cart/CartList';
import { FaArrowLeft, FaShoppingCart, FaLock, FaTag, FaTruck } from 'react-icons/fa';
import './CartPage.css';

const CartPage = () => {
  const { 
    cartItems, 
    loading, 
    error, 
    subtotal, 
    updateItemQuantity, 
    removeItem, 
    clearCart 
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [clearingCart, setClearingCart] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Calculate cart totals
  const itemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = subtotal || cartItems.reduce(
    (total, item) => {
      // Handle MongoDB Decimal128 price format or regular price
      const price = item.product_id ? 
        (typeof item.product_id.price === 'object' && item.product_id.price.$numberDecimal ? 
          parseFloat(item.product_id.price.$numberDecimal) : 
          (parseFloat(item.product_id.price) || 0)) : 
        0;
      
      return total + price * item.quantity;
    }, 
    0
  );
  const shippingCost = cartSubtotal > 50 ? 0 : 10;
  const tax = cartSubtotal * 0.15; // 15% tax
  const cartTotal = cartSubtotal + shippingCost + tax;

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setClearingCart(true);
      setActionError(null);
      try {
        await clearCart();
      } catch (err) {
        setActionError('Failed to clear cart. Please try again.');
      } finally {
        setClearingCart(false);
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        background: 'linear-gradient(145deg, #1a1f35 0%, #232946 100%)',
        minHeight: '100vh',
        padding: '2rem 0'
      }}
    >
      <Container className="py-4 cart-page">
        <h1 className="mb-4">
          <FaShoppingCart className="me-2" />
          Your Shopping Cart
        </h1>

        {actionError && (
          <Alert variant="danger" dismissible onClose={() => setActionError(null)}>
            {actionError}
          </Alert>
        )}

        <Row>
          <Col lg={8} className="mb-4 mb-lg-0">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  Cart Items 
                  <span className="ms-2 badge rounded-pill bg-primary bg-opacity-25">
                    {itemsCount}
                  </span>
                </h5>
                {cartItems.length > 0 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={handleClearCart}
                    disabled={clearingCart}
                    className="clear-cart-btn"
                  >
                    {clearingCart ? 'Clearing...' : 'Clear Cart'}
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <CartList 
                  cartItems={cartItems}
                  loading={loading}
                  error={error}
                  onUpdateQuantity={updateItemQuantity}
                  onRemoveItem={removeItem}
                />
              </Card.Body>
            </Card>

            <div className="mt-4">
              <Button as={Link} to="/products" variant="outline-primary" className="continue-shopping-btn">
                <FaArrowLeft className="me-2" />
                Continue Shopping
              </Button>
            </div>
          </Col>

          <Col lg={4}>
            <Card className="order-summary">
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="summary-item">
                  <span className="summary-label">Subtotal:</span>
                  <span className="summary-value">${cartSubtotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">
                    <FaTruck className="me-1" size={14} /> Shipping:
                  </span>
                  <span className="summary-value">
                    {shippingCost === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">Tax (15%):</span>
                  <span className="summary-value">${tax.toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-item summary-total">
                  <span className="summary-label">Total:</span>
                  <span className="summary-value">${cartTotal.toFixed(2)}</span>
                </div>

                {cartSubtotal < 50 && cartSubtotal > 0 && (
                  <div className="mt-3 mb-4">
                    <div className="free-shipping-alert p-2 rounded" style={{ background: 'rgba(244, 93, 160, 0.1)', fontSize: '0.9rem' }}>
                      <FaTag className="me-2" />
                      Add <strong>${(50 - cartSubtotal).toFixed(2)}</strong> more to get <strong>FREE shipping!</strong>
                    </div>
                  </div>
                )}

                <div className="d-grid mt-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="checkout-btn"
                  >
                    <FaLock className="me-2" />
                    {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                  </Button>
                </div>
                
                {!isAuthenticated && cartItems.length > 0 && (
                  <Alert variant="info" className="mt-3 mb-0">
                    Please <Link to="/login?redirect=checkout" className="text-decoration-none fw-bold">login</Link> or <Link to="/register?redirect=checkout" className="text-decoration-none fw-bold">register</Link> to checkout.
                  </Alert>
                )}
                
                <div className="mt-3 text-center">
                  <small className="text-muted d-block mb-1">Secure Checkout</small>
                  <div className="payment-icons d-flex justify-content-center gap-2" style={{ opacity: 0.6 }}>
                    {/* Payment icons could be added here */}
                    <div className="payment-icon p-1 bg-light rounded" style={{ width: '40px', height: '25px' }}></div>
                    <div className="payment-icon p-1 bg-light rounded" style={{ width: '40px', height: '25px' }}></div>
                    <div className="payment-icon p-1 bg-light rounded" style={{ width: '40px', height: '25px' }}></div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default CartPage;