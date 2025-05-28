import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  FaLock, 
  FaShoppingBag, 
  FaAddressCard, 
  FaCreditCard, 
  FaChevronRight, 
  FaCreditCard as FaCCard, 
  FaPaypal, 
  FaUniversity, 
  FaMoneyBillWave,
  FaCheck,
  FaMapMarkerAlt,
  FaPhone
} from 'react-icons/fa';
import { createOrder } from '../api/order';
import { processPayment } from '../api/payment';
import { addAddress } from '../api/address';
import './CheckoutPage.css';
import './CheckoutPageEnhancements.css';

const CheckoutPage = () => {  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
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
  
  const renderShippingStep = () => (    <div className="checkout-card">
      <div className="checkout-card-header">
        <FaAddressCard className="me-3" size={24} color="#4f46e5" />
        <h5>Shipping Information</h5>
      </div>
      <div className="checkout-card-body">
        <Form onSubmit={handleShippingSubmit}>          <Form.Group className="checkout-form-group">
            <Form.Label className="checkout-form-label">
              <FaMapMarkerAlt className="me-2" />
              Address
            </Form.Label>
            <Form.Control 
              type="text" 
              style={{ color: 'white' }}
              placeholder="Enter your street address"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
              required
              className="checkout-form-control"
            />
          </Form.Group>
          
          <Row>            <Col md={6}>
              <Form.Group className="checkout-form-group">
                <Form.Label className="checkout-form-label">
                  <FaMapMarkerAlt className="me-2" />
                  City
                </Form.Label>
                <Form.Control  
              style={{ color: 'white' }}
                  type="text" 
                  placeholder="Enter your city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  required
                  className="checkout-form-control"
                />
              </Form.Group>
            </Col>            <Col md={6}>
              <Form.Group className="checkout-form-group">
                <Form.Label className="checkout-form-label">
                  <FaMapMarkerAlt className="me-2" />
                  Postal/ZIP Code
                </Form.Label>
                <Form.Control 
                  type="text" 
              style={{ color: 'white' }}
                  placeholder="Enter postal code"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  required
                  className="checkout-form-control"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>            <Col md={6}>
              <Form.Group className="checkout-form-group">
                <Form.Label className="checkout-form-label">
                  <FaMapMarkerAlt className="me-2" />
                  Country
                </Form.Label>
                <Form.Control 
                  type="text"  
              style={{ color: 'white' }}
                  placeholder="Enter your country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                  required
                  className="checkout-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="checkout-form-group">
                <Form.Label className="checkout-form-label">
                  <FaPhone className="me-2" />
                  Phone Number
                </Form.Label>
                <Form.Control 
                  type="tel" 
              style={{ color: 'white' }}
                  placeholder="Enter phone number"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                  className="checkout-form-control"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <div className="text-end mt-4">
            <Button variant="primary" type="submit" className="btn-checkout">
              Continue to Payment <FaChevronRight className="ms-2" />
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
  
  const renderPaymentStep = () => {
    const getPaymentIcon = (method) => {
      switch(method) {
        case 'credit_card': return <FaCCard />;
        case 'paypal': return <FaPaypal />;
        case 'bank_transfer': return <FaUniversity />;
        case 'cash_on_delivery': return <FaMoneyBillWave />;
        default: return <FaCreditCard />;
      }
    };
    
    return (      <div className="checkout-card">
        <div className="checkout-card-header">
          <FaCreditCard className="me-3" size={24} color="#4f46e5" />
          <h5>Payment Method</h5>
        </div>
        <div className="checkout-card-body">
          <Form onSubmit={handlePaymentSubmit}>
            <div className="checkout-form-group">
              {['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'].map((method) => (
                <div 
                  key={method}
                  className={`payment-method-option ${paymentMethod === method ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  <Form.Check 
                    type="radio"
                    id={method}
                    name="paymentMethod"
                    value={method}
                    label={
                      <span className="d-flex align-items-center" style={{ color: 'white' }}>
                        {getPaymentIcon(method)}
                        <span className="ms-2" style={{ color: 'white' }}>
                          {method === 'credit_card' ? 'Credit Card' :
                           method === 'paypal' ? 'PayPal' :
                           method === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}
                        </span>
                      </span>
                    }
                    checked={paymentMethod === method}
                    onChange={handlePaymentMethodChange}
                  />
                </div>
              ))}
            </div>
            
            <div className="d-flex justify-content-between mt-4">
              <Button variant="outline-secondary" onClick={() => setStep(1)} className="btn-back">
                Back
              </Button>
              <Button variant="primary" type="submit" className="btn-checkout">
                Continue to Review <FaChevronRight className="ms-2" />
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  };
  
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
    
    return (      <div className="checkout-card">
        <div className="checkout-card-header">
          <FaShoppingBag className="me-3" size={24} color="#4f46e5" />
          <h5>Review Your Order</h5>
        </div>
        <div className="checkout-card-body">
          <h6>Shipping Address</h6>
          <p className="text-muted mb-4">
            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            <br />
            {shippingAddress.phone && `Phone: ${shippingAddress.phone}`}
          </p>
          
          <h6>Payment Method</h6>
          <p className="text-muted mb-4" >
            {paymentMethod === 'credit_card' ? 'Credit Card' : 
             paymentMethod === 'paypal' ? 'PayPal' : 
             paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}
          </p>
          
          <h6>Order Items</h6>
          <div className="mb-4">
            {cartItems.map(item => {
              const price = getProductPrice(item);
              const itemTotal = price * item.quantity;
              
              return (
                <div key={item._id} className="review-item">
                  <img 
                    src={item.product_id?.image_url || 'https://via.placeholder.com/50x50'}
                    alt={item.product_id?.name}
                    className="review-item-image"
                  />
                  <div className="review-item-details">
                    <div className="review-item-name">{item.product_id?.name}</div>
                    {item.variant_id && <div className="review-item-variant">Variant: {item.variant_id.name || 'Standard'}</div>}
                    <div className="text-muted">Quantity: {item.quantity}</div>
                  </div>
                  <div className="review-item-price">
                    ${itemTotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="order-summary-row">
            <span className="order-summary-label">Subtotal:</span>
            <span className="order-summary-value">${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="order-summary-row">
            <span className="order-summary-label">Shipping:</span>
            <span className="order-summary-value">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          
          <div className="order-summary-row">
            <span className="order-summary-label">Tax:</span>
            <span className="order-summary-value">${tax.toFixed(2)}</span>
          </div>
            <div className="order-summary-row order-summary-total">
            <span className="order-summary-label">Total:</span>
            <span className="order-summary-value">${orderTotal.toFixed(2)}</span>
          </div>
          
          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-secondary" onClick={() => setStep(2)} className="btn-back">
              Back
            </Button>
            <Button 
              variant="success" 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn-checkout"
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
        </div>
      </div>
    );
  };
  return (
    <div className="checkout-container">
      <Container>
        <h1 className="checkout-title">Secure Checkout</h1>
        
        {/* Progress Steps */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">{step > 1 ? <FaCheck /> : '1'}</div>
            <div className="step-title">Shipping</div>
          </div>
          <div className={`step-connector ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">{step > 2 ? <FaCheck /> : '2'}</div>
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
        <Col lg={8}>
          {step === 1 && renderShippingStep()}
          {step === 2 && renderPaymentStep()}
          {step === 3 && renderReviewStep()}
        </Col>
        
        <Col lg={4}>
          <div className="order-summary-card">
            <div className="order-summary-header">
              <h5 className="mb-0" style={{color:'white'}}>Order Summary</h5>
            </div>
            <div className="order-summary-body">
              <div className="order-summary-row">
                <span className="order-summary-label">Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
                <span className="order-summary-value">${subtotal.toFixed(2)}</span>
              </div>
              <div className="order-summary-row">
                <span className="order-summary-label">Shipping:</span>
                <span className="order-summary-value">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="order-summary-row">
                <span className="order-summary-label">Tax:</span>
                <span className="order-summary-value">${tax.toFixed(2)}</span>
              </div>              <div className="order-summary-row order-summary-total">
                <span className="order-summary-label">Order Total:</span>
                <span className="order-summary-value">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>        </Col>
      </Row>
    </Container>
  </div>
);
};

export default CheckoutPage;