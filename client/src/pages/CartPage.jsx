import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartList from '../components/Cart/CartList';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
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
    (total, item) => total + (item.product?.price || 0) * item.quantity, 
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
    <Container className="py-5 cart-page">
      <h1 className="mb-4">
        <FaShoppingCart className="me-2" />
        Your Cart
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
              <h5 className="mb-0">Cart Items ({itemsCount})</h5>
              {cartItems.length > 0 && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleClearCart}
                  disabled={clearingCart}
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
            <Button as={Link} to="/products" variant="outline-primary">
              <FaArrowLeft className="me-2" />
              Continue Shopping
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal:</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>
                  {shippingCost === 0 ? (
                    'Free'
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tax (15%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4 fw-bold">
                <span>Total:</span>
                <span className="text-primary">${cartTotal.toFixed(2)}</span>
              </div>

              <div className="d-grid">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Button>
              </div>
              
              {!isAuthenticated && cartItems.length > 0 && (
                <Alert variant="info" className="mt-3 mb-0">
                  Please <Link to="/login?redirect=checkout">login</Link> or <Link to="/register?redirect=checkout">register</Link> to checkout.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;