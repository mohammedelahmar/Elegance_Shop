import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
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
import { addAddress, getUserAddresses } from '../api/address';
import PayPalButton from '../components/Payment/PayPalButton';
import CreditCardModal from '../components/Payment/CreditCardModal';
import './CheckoutPage.css';
import './CheckoutPageEnhancements.css';

const CheckoutPage = () => {  
  const navigate = useNavigate();
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
  
  // New state variables for user addresses
  const [userAddresses, setUserAddresses] = useState([]);
  const [fetchingAddresses, setFetchingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  // New state variables for PayPal
  const [showPayPalButtons, setShowPayPalButtons] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  // New state variables for Credit Card Modal
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  
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
  
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (isAuthenticated) {
        try {
          setFetchingAddresses(true);
          const addresses = await getUserAddresses();
          setUserAddresses(addresses);
          // Pre-select the first address if available
          if (addresses.length > 0) {
            setSelectedAddressId(addresses[0]._id);
            // Pre-fill shipping form with the selected address
            populateShippingFormWithAddress(addresses[0]);
          } else {
            setUseNewAddress(true);
          }
        } catch (err) {
          console.error('Error fetching user addresses:', err);
        } finally {
          setFetchingAddresses(false);
        }
      }
    };
    
    fetchUserAddresses();
  }, [isAuthenticated]);
  
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
      // If credit card payment, we need to create the order first but not process payment yet
      if (paymentMethod === 'credit_card') {
        setCreatingOrder(true);
        
        // Create a new address or use existing one
        let addressId;
        if (selectedAddressId && !useNewAddress) {
          addressId = selectedAddressId;
        } else {
          // Create a new address code...
          const addressData = await addAddress({
            address: shippingAddress.address,
            city: shippingAddress.city,
            postal_code: shippingAddress.postalCode,
            country: shippingAddress.country,
            phone_number: shippingAddress.phone || '' 
          });
          addressId = addressData._id;
        }
        
        // Create order
        const orderData = await createOrder({
          orderItems: cartItems.map(item => ({
            product: item.product_id?._id || item.product_id,
            quantity: item.quantity,
            variant: item.variant_id || undefined
          })),
          shippingAddress: addressId,
          paymentMethod,
          itemsPrice: subtotal,
          taxPrice: tax,
          shippingPrice: shippingCost,
          totalPrice: orderTotal
        });
        
        setCreatedOrderId(orderData._id);
        setCreatingOrder(false);
        setLoading(false);
        
        // Show credit card modal
        setShowCreditCardModal(true);
        return;
      }
      
      // For PayPal, create the order first and then show PayPal buttons
      if (paymentMethod === 'paypal') {
        setCreatingOrder(true);
        
        // Create a new address or use existing one
        let addressId;
        if (selectedAddressId && !useNewAddress) {
          addressId = selectedAddressId;
        } else {
          // Create a new address
          const addressData = await addAddress({
            address: shippingAddress.address,
            city: shippingAddress.city,
            postal_code: shippingAddress.postalCode,
            country: shippingAddress.country,
            phone_number: shippingAddress.phone || '' 
          });
          addressId = addressData._id;
        }
        
        // Create order
        const orderData = await createOrder({
          orderItems: cartItems.map(item => ({
            product: item.product_id?._id || item.product_id,
            quantity: item.quantity,
            variant: item.variant_id || undefined
          })),
          shippingAddress: addressId,
          paymentMethod,
          itemsPrice: subtotal,
          taxPrice: tax,
          shippingPrice: shippingCost,
          totalPrice: orderTotal
        });
        
        setCreatedOrderId(orderData._id);
        setCreatingOrder(false);
        
        // Show PayPal buttons after creating order
        setShowPayPalButtons(true);
        setLoading(false);
        return;
      }
      
      // For Cash on Delivery, redirect to payment success page with COD method
      if (paymentMethod === 'cash_on_delivery') {
        await processPayment({
          paymentMethod,
          amount: orderTotal,
          currency: 'USD',
          orderId: createdOrderId
        });
        
        await clearCart();
        navigate(`/payment-success/${createdOrderId}?method=cod`);
      } else if (paymentMethod === 'bank_transfer') {
        // For bank transfer, redirect to bank transfer instructions page
        await processPayment({
          paymentMethod,
          amount: orderTotal,
          currency: 'USD',
          orderId: createdOrderId
        });
        
        await clearCart();
        navigate(`/bank-transfer/${createdOrderId}`);
      } else {
        // For other payment methods, process payment as usual
        await processPayment({
          paymentMethod,
          amount: orderTotal,
          currency: 'USD',
          orderId: createdOrderId
        });
        
        await clearCart();
        navigate(`/order/${createdOrderId}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to complete your order. Please try again.');
      setLoading(false);
      setCreatingOrder(false);
    }
  };

  const handleCreditCardSubmit = async (cardData) => {
    setLoading(true);
    try {
      // Process the payment using the credit card data
      await processPayment({
        paymentMethod: 'credit_card',
        amount: orderTotal,
        currency: 'USD',
        orderId: createdOrderId,
        cardDetails: cardData // You might need to add this to your API
      });
      
      await clearCart();
      navigate(`/payment-success/${createdOrderId}?method=credit_card`);
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
      setLoading(false);
    }
  };

  const handlePayPalSuccess = async (details) => {
    try {
      // Process the successful PayPal payment on your server
      await processPayment({
        paymentMethod: 'paypal',
        amount: orderTotal,
        currency: 'USD',
        orderId: createdOrderId,
        paypalDetails: details
      });
      
      await clearCart();
      navigate(`/payment-success/${createdOrderId}?method=paypal`);
    } catch (err) {
      setError('Payment was processed but we encountered an error. Please contact support.');
    }
  };

  const handlePayPalError = (err) => {
    setError(`PayPal error: ${err.message || 'Unknown error'}`);
  };
  
  const handleAddressSelection = (e) => {
    const addressId = e.target.value;
    if (addressId === 'new') {
      setUseNewAddress(true);
      setSelectedAddressId(null);
      // Clear the shipping form
      setShippingAddress({
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: ''
      });
    } else {
      setUseNewAddress(false);
      setSelectedAddressId(addressId);
      // Find the selected address and populate the form
      const selectedAddress = userAddresses.find(addr => addr._id === addressId);
      if (selectedAddress) {
        populateShippingFormWithAddress(selectedAddress);
      }
    }
  };
  
  const populateShippingFormWithAddress = (address) => {
    setShippingAddress({
      address: address.address || '',
      city: address.city || '',
      postalCode: address.postal_code || '',
      country: address.country || '',
      phone: address.phone_number || ''
    });
  };
  
  const renderShippingStep = () => (
    <div className="checkout-card">
      <div className="checkout-card-header">
        <FaAddressCard className="me-3" size={24} color="#4f46e5" />
        <h5>Shipping Information</h5>
      </div>
      <div className="checkout-card-body">
        {fetchingAddresses ? (
          <div className="text-center py-3">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading your addresses...</p>
          </div>
        ) : (
          <Form onSubmit={handleShippingSubmit}>
            {/* Address Selection Section */}
            {userAddresses.length > 0 && (
              <div className="mb-4">
                <Form.Group className="checkout-form-group">
                  <Form.Label className="checkout-form-label">
                    <FaMapMarkerAlt className="me-2" />
                    Select a Shipping Address
                  </Form.Label>
                  <Form.Select 
                    value={selectedAddressId || 'new'} 
                    onChange={handleAddressSelection}
                    style={{ color: 'white', backgroundColor: '#2d2f39' }}
                    className="checkout-form-control"
                  >
                    {userAddresses.map(addr => (
                      <option key={addr._id} value={addr._id}>
                        {addr.address}, {addr.city}, {addr.country}
                      </option>
                    ))}
                    <option value="new">+ Add New Address</option>
                  </Form.Select>
                </Form.Group>
                
                {selectedAddressId && (
                  <div className="selected-address-preview mt-3 p-3 border rounded">
                    <div className="d-flex justify-content-between">
                      <h6>Selected Address</h6>
                      <Link to={`/address/edit?id=${selectedAddressId}`} target="_blank" className="text-decoration-none">
                        Edit this address
                      </Link>
                    </div>
                    {userAddresses.find(addr => addr._id === selectedAddressId) && (
                      <p className="mb-0">
                        {userAddresses.find(addr => addr._id === selectedAddressId).address}<br />
                        {userAddresses.find(addr => addr._id === selectedAddressId).city}, {userAddresses.find(addr => addr._id === selectedAddressId).postal_code}<br />
                        {userAddresses.find(addr => addr._id === selectedAddressId).country}<br />
                        Phone: {userAddresses.find(addr => addr._id === selectedAddressId).phone_number || 'N/A'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* New Address Form Section - Only show if useNewAddress is true or no addresses available */}
            {(useNewAddress || userAddresses.length === 0) && (
              <>
                <div className="mb-3">
                  <h6>{userAddresses.length > 0 ? 'Enter New Address Details' : 'Enter Shipping Address'}</h6>
                </div>
                
                <Form.Group className="checkout-form-group">
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
                
                <Row>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
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
                
                <Row>
                  <Col md={6}>
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
              </>
            )}
            
            <div className="text-end mt-4">
              <Button variant="primary" type="submit" className="btn-checkout">
                Continue to Payment <FaChevronRight className="ms-2" />
              </Button>
            </div>
          </Form>
        )}
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
    
    return (      
      <div className="checkout-card">
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
    
    return (      
      <div className="checkout-card">
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
          
          {showPayPalButtons && paymentMethod === 'paypal' ? (
            <div className="w-100 mt-3">
              <PayPalButton 
                amount={orderTotal} 
                onSuccess={handlePayPalSuccess} 
                onError={handlePayPalError} 
                orderId={createdOrderId} 
              />
            </div>
          ) : (
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
                    {paymentMethod === 'paypal' ? 'Continue to PayPal' : 'Place Order'}
                  </>
                )}
              </Button>
            </div>
          )}
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
              </div>              
              <div className="order-summary-row order-summary-total">
                <span className="order-summary-label">Order Total:</span>
                <span className="order-summary-value">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>        
        </Col>
      </Row>
      
      {/* Credit Card Modal */}
      <CreditCardModal
        show={showCreditCardModal}
        onHide={() => setShowCreditCardModal(false)}
        amount={orderTotal}
        onSubmit={handleCreditCardSubmit}
        loading={loading}
      />
    </Container>
  </div>
);
};

export default CheckoutPage;