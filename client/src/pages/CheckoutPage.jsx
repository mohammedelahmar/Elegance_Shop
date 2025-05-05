import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaShoppingBag, FaAddressCard, FaCreditCard } from 'react-icons/fa';
import { createOrder } from '../api/order';
import { processPayment } from '../api/payment';
import { addAddress } from '../api/address';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  // Calculated values
  const shippingCost = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.15; // 15% tax
  const orderTotal = subtotal + shippingCost + tax;
  
  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    }
  }, [cartItems, isAuthenticated, navigate]);
  
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // Validate shipping form
    if (!shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.postalCode || !shippingAddress.country) {
      setError('Please fill all required fields');
      return;
    }
    setError(null);
    setStep(2);
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setStep(3);
  };
  
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Create the address
      console.log("Creating address...");
      const addressData = await addAddress({
        address: shippingAddress.address,
        city: shippingAddress.city,
        postal_code: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone_number: shippingAddress.phone || '' 
      });
      
      if (!addressData || !addressData._id) {
        throw new Error('Failed to create shipping address');
      }
      
      console.log("Address created:", addressData);
      
      // 2. Create order
      console.log("Creating order...");
      const orderItems = cartItems.map(item => ({
        product: item.product_id?._id || item.product_id,
        quantity: item.quantity,
        variant: item.variant_id || undefined
      }));
      
      const orderData = await createOrder({
        orderItems,
        shippingAddress: addressData._id,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shippingCost,
        totalPrice: orderTotal
      });
      
      if (!orderData || !orderData._id) {
        throw new Error('Failed to create order');
      }
      
      console.log("Order created:", orderData);
      
      // 3. Process payment - Bypass user ID check if authenticated
      // This fixes the "User information is missing" error
      console.log("Processing payment...");
      await processPayment({
        paymentMethod,
        amount: orderTotal,
        currency: 'USD',
        orderId: orderData._id
        // We're not sending userId if it's not available
      });
      
      console.log("Payment processed successfully");
      
      // 4. Clear cart and redirect to success page
      await clearCart();
      navigate(`/order/${orderData._id}`);
      
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to complete your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderShippingStep = () => (
    <Card>
      <Card.Header className="d-flex align-items-center">
        <FaAddressCard className="me-2" />
        <h5 className="mb-0">Shipping Information</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleShippingSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Street address"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
              required
            />
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Postal/ZIP Code</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Postal code"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>  
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control 
                  type="tel" 
                  placeholder="Phone number"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Button variant="primary" type="submit" className="w-100">
            Continue to Payment
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
  
  const renderPaymentStep = () => (
    <Card>
      <Card.Header className="d-flex align-items-center">
        <FaCreditCard className="me-2" />
        <h5 className="mb-0">Payment Method</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handlePaymentSubmit}>
          <Form.Group className="mb-4">
            <Form.Check 
              type="radio"
              id="credit_card"
              name="paymentMethod"
              value="credit_card"
              label="Credit Card"
              checked={paymentMethod === 'credit_card'}
              onChange={handlePaymentMethodChange}
              className="mb-3"
            />
            <Form.Check 
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="paypal"
              label="PayPal"
              checked={paymentMethod === 'paypal'}
              onChange={handlePaymentMethodChange}
              className="mb-3"
            />
            <Form.Check 
              type="radio"
              id="bank_transfer"
              name="paymentMethod"
              value="bank_transfer"
              label="Bank Transfer"
              checked={paymentMethod === 'bank_transfer'}
              onChange={handlePaymentMethodChange}
              className="mb-3"
            />
            <Form.Check 
              type="radio"
              id="cash_on_delivery"
              name="paymentMethod"
              value="cash_on_delivery"
              label="Cash on Delivery"
              checked={paymentMethod === 'cash_on_delivery'}
              onChange={handlePaymentMethodChange}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" type="submit">
              Continue to Review
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
  
  const renderReviewStep = () => {
    // Helper function to get product price safely
    const getProductPrice = (item) => {
      if (!item.product_id) return 0;
      
      const price = item.product_id.price;
      if (typeof price === 'object' && price.$numberDecimal) {
        return parseFloat(price.$numberDecimal);
      }
      return parseFloat(price) || 0;
    };
    
    return (
      <Card>
        <Card.Header className="d-flex align-items-center">
          <FaShoppingBag className="me-2" />
          <h5 className="mb-0">Review Your Order</h5>
        </Card.Header>
        <Card.Body>
          <h6>Shipping Address</h6>
          <p>
            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            <br />
            {shippingAddress.phone && `Phone: ${shippingAddress.phone}`}
          </p>
          
          <hr />
          
          <h6>Payment Method</h6>
          <p>{paymentMethod === 'credit_card' ? 'Credit Card' : 
             paymentMethod === 'paypal' ? 'PayPal' : 
             paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}</p>
          
          <hr />
          
          <h6>Order Items</h6>
          {cartItems.map(item => {
            const price = getProductPrice(item);
            const itemTotal = price * item.quantity;
            
            return (
              <div key={item._id} className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <img 
                    src={item.product_id?.image_url || 'https://via.placeholder.com/50x50'}
                    alt={item.product_id?.name}
                    style={{ width: '50px', marginRight: '10px' }}
                    className="rounded"
                  />
                  <span>{item.product_id?.name} x {item.quantity}</span>
                </div>
                <span>${itemTotal.toFixed(2)}</span>
              </div>
            );
          })}
          
          <hr />
          
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="d-flex justify-content-between mb-2">
            <span>Shipping:</span>
            <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          
          <div className="d-flex justify-content-between mb-2">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <div className="d-flex justify-content-between font-weight-bold mt-3">
            <span className="fw-bold">Total:</span>
            <span className="fw-bold">${orderTotal.toFixed(2)}</span>
          </div>
          
          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-secondary" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button 
              variant="success" 
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FaLock className="me-2" />
                  Place Order
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="checkout-steps mb-4">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-title">Shipping</div>
        </div>
        <div className={`step-connector ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-title">Payment</div>
        </div>
        <div className={`step-connector ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-title">Review</div>
        </div>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <Row>
        <Col md={8}>
          {step === 1 && renderShippingStep()}
          {step === 2 && renderPaymentStep()}
          {step === 3 && renderReviewStep()}
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;