
import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    address2: "",
    country: "",
    state: "",
    zip: "",
    paymentMethod: "credit"
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when field is edited
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ""
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Email is not valid";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zip.trim()) newErrors.zip = "Zip code is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/order-success');
    }, 2000);
  };

  const EmptyCart = () => {
    return (
      <div className="empty-checkout">
        <div className="empty-checkout-content">
          <div className="empty-checkout-icon">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Add items to your cart before proceeding to checkout.</p>
          <Link to="/products" className="continue-shopping-btn">
            <i className="fas fa-arrow-left"></i> Browse Products
          </Link>
        </div>
      </div>
    );
  };

  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    
    // Fix NaN issues by ensuring all values are numbers with defaults
    state.forEach((item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      subtotal += price * qty;
      totalItems += qty;
    });

    return (
      <div className="checkout-container">
        <div className="checkout-steps">
          <div className="step active">
            <div className="step-number">1</div>
            <div className="step-label">Shipping</div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-label">Payment</div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="shipping-details">
            <div className="form-card">
              <div className="card-header">
                <h3>Shipping Information</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        className={errors.firstName ? "form-input error" : "form-input"}
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                    </div>
                    
                    <div className="form-group half">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        className={errors.lastName ? "form-input error" : "form-input"}
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group full">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        className={errors.email ? "form-input error" : "form-input"}
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group full">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        className={errors.address ? "form-input error" : "form-input"}
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errors.address && <div className="error-message">{errors.address}</div>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group full">
                      <label htmlFor="address2">Address 2 (Optional)</label>
                      <input
                        type="text"
                        id="address2"
                        className="form-input"
                        value={formData.address2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group third">
                      <label htmlFor="country">Country</label>
                      <select 
                        id="country"
                        className={errors.country ? "form-select error" : "form-select"}
                        value={formData.country}
                        onChange={handleChange}
                      >
                        <option value="">Select...</option>
                        <option value="USA">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="FR">France</option>
                      </select>
                      {errors.country && <div className="error-message">{errors.country}</div>}
                    </div>
                    
                    <div className="form-group third">
                      <label htmlFor="state">State</label>
                      <select 
                        id="state"
                        className={errors.state ? "form-select error" : "form-select"}
                        value={formData.state}
                        onChange={handleChange}
                      >
                        <option value="">Select...</option>
                        <option value="NY">New York</option>
                        <option value="CA">California</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="IL">Illinois</option>
                      </select>
                      {errors.state && <div className="error-message">{errors.state}</div>}
                    </div>
                    
                    <div className="form-group third">
                      <label htmlFor="zip">Zip/Postal Code</label>
                      <input
                        type="text"
                        id="zip"
                        className={errors.zip ? "form-input error" : "form-input"}
                        value={formData.zip}
                        onChange={handleChange}
                      />
                      {errors.zip && <div className="error-message">{errors.zip}</div>}
                    </div>
                  </div>
                  
                  <div className="form-divider"></div>
                  
                  <div className="payment-section">
                    <h3>Payment Method</h3>
                    <div className="payment-methods">
                      <div className="payment-method-option">
                        <input
                          type="radio"
                          id="credit"
                          name="paymentMethod"
                          value="credit"
                          checked={formData.paymentMethod === "credit"}
                          onChange={() => setFormData({...formData, paymentMethod: "credit"})}
                        />
                        <label htmlFor="credit">
                          <div className="payment-icon"><i className="far fa-credit-card"></i></div>
                          <div className="payment-details">
                            <span className="payment-name">Credit Card</span>
                            <div className="payment-cards">
                              <i className="fab fa-cc-visa"></i>
                              <i className="fab fa-cc-mastercard"></i>
                              <i className="fab fa-cc-amex"></i>
                            </div>
                          </div>
                        </label>
                      </div>
                      
                      <div className="payment-method-option">
                        <input
                          type="radio"
                          id="paypal"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === "paypal"}
                          onChange={() => setFormData({...formData, paymentMethod: "paypal"})}
                        />
                        <label htmlFor="paypal">
                          <div className="payment-icon"><i className="fab fa-paypal"></i></div>
                          <div className="payment-details">
                            <span className="payment-name">PayPal</span>
                            <span className="payment-description">Checkout with your PayPal account</span>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="secure-payment-notice">
                      <i className="fas fa-lock"></i> Your payment information is processed securely.
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className={`checkout-submit-btn ${isProcessing ? "processing" : ""}`}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Order <i className="fas fa-arrow-right"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="order-summary">
            <div className="summary-card">
              <div className="card-header">
                <h3>Order Summary</h3>
              </div>
              <div className="card-body">
                <div className="cart-items">
                  {state.map((item) => {
                    const price = Number(item.price) || 0;
                    const qty = Number(item.quantity) || 1;
                    
                    return (
                      <div key={item.id} className="summary-item">
                        <div className="item-image">
                          <img src={item.image} alt={item.title} />
                          <span className="item-quantity">{qty}</span>
                        </div>
                        <div className="item-details">
                          <div className="item-title">{item.title.substring(0, 20)}...</div>
                          {item.size && <div className="item-size">Size: {item.size}</div>}
                        </div>
                        <div className="item-price">${(price * qty).toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${(subtotal + shipping).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <style>{`
        /* Checkout Styles */
        .checkout-page-title {
          padding: 3rem 0 1.5rem;
          text-align: center;
        }
        
        .checkout-page-title h1 {
          font-size: 2.2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        
        .checkout-page-title .underline {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          margin: 0 auto;
        }
        
        /* Empty Checkout Styles */
        .empty-checkout {
          background: #f8fafc;
          padding: 5rem 0;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .empty-checkout-content {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .empty-checkout-icon {
          font-size: 5rem;
          color: #cbd5e1;
          margin-bottom: 2rem;
        }
        
        .empty-checkout h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        
        .empty-checkout p {
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 2rem;
        }
        
        .continue-shopping-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          font-weight: 600;
          padding: 0.8rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .continue-shopping-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          color: white;
        }
        
        /* Checkout Steps */
        .checkout-container {
          padding: 0 0 4rem;
        }
        
        .checkout-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 3rem;
          position: relative;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
        }
        
        .step-number {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .step.active .step-number {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
        }
        
        .step-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #64748b;
        }
        
        .step.active .step-label {
          color: #0f172a;
          font-weight: 600;
        }
        
        .step-connector {
          height: 2px;
          background: #e2e8f0;
          flex-grow: 1;
          margin: 0 0.5rem;
          z-index: 1;
          position: relative;
          top: -18px;
          width: 80px;
        }
        
        /* Checkout Content */
        .checkout-content {
          display: flex;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .shipping-details {
          flex: 1;
        }
        
        .order-summary {
          width: 380px;
        }
        
        /* Form Styles */
        .form-card, .summary-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .card-header h3 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group.half {
          width: 50%;
        }
        
        .form-group.third {
          width: calc(33.33% - 0.67rem);
        }
        
        .form-group.full {
          width: 100%;
        }
        
        .form-group label {
          font-size: 0.9rem;
          color: #475569;
          margin-bottom: 0.5rem;
        }
        
        .form-input, .form-select {
          padding: 0.8rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        
        .form-input:focus, .form-select:focus {
          border-color: #3b82f6;
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        .form-input.error, .form-select.error {
          border-color: #ef4444;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 0.4rem;
        }
        
        .form-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 2rem 0;
        }
        
        /* Payment Methods */
        .payment-section h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }
        
        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .payment-method-option {
          display: flex;
        }
        
        .payment-method-option input[type="radio"] {
          display: none;
        }
        
        .payment-method-option label {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .payment-method-option input[type="radio"]:checked + label {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }
        
        .payment-icon {
          font-size: 1.5rem;
          color: #64748b;
          margin-right: 1rem;
          width: 30px;
          display: flex;
          justify-content: center;
        }
        
        .payment-details {
          flex: 1;
        }
        
        .payment-name {
          font-weight: 600;
          font-size: 1rem;
          color: #0f172a;
          display: block;
          margin-bottom: 0.3rem;
        }
        
        .payment-description {
          font-size: 0.85rem;
          color: #64748b;
        }
        
        .payment-cards {
          display: flex;
          gap: 0.5rem;
          font-size: 1.4rem;
        }
        
        .secure-payment-notice {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #64748b;
          margin: 1rem 0 2rem;
        }
        
        .secure-payment-notice i {
          color: #16a34a;
        }
        
        /* Checkout Button */
        .checkout-submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .checkout-submit-btn:not(:disabled):hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        .checkout-submit-btn.processing {
          opacity: 0.8;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Order Summary */
        .summary-card {
          position: sticky;
          top: 2rem;
        }
        
        .cart-items {
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 1rem;
          padding-right: 0.5rem;
        }
        
        .summary-item {
          display: flex;
          align-items: center;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .summary-item:last-child {
          margin-bottom: 0;
          border-bottom: none;
        }
        
        .item-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          margin-right: 1rem;
          position: relative;
          background: #f8fafc;
          padding: 0.3rem;
        }
        
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .item-quantity {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #3b82f6;
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
        }
        
        .item-details {
          flex: 1;
          padding-right: 0.5rem;
        }
        
        .item-title {
          font-size: 0.9rem;
          font-weight: 500;
          color: #0f172a;
          margin-bottom: 0.2rem;
        }
        
        .item-size {
          font-size: 0.8rem;
          color: #64748b;
        }
        
        .item-price {
          font-weight: 600;
          color: #0f172a;
        }
        
        .summary-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 1rem 0;
        }
        
        .summary-totals {
          margin-top: 1rem;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
          color: #475569;
        }
        
        .summary-row.total {
          font-weight: 600;
          font-size: 1.2rem;
          color: #0f172a;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        
        /* Responsive Styles */
        @media (max-width: 992px) {
          .checkout-content {
            flex-direction: column-reverse;
          }
          
          .order-summary {
            width: 100%;
            margin-bottom: 2rem;
          }
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .form-group.half, .form-group.third {
            width: 100%;
          }
          
          .checkout-page-title h1 {
            font-size: 1.8rem;
          }
          
          .checkout-steps {
            padding: 0 1rem;
          }
          
          .step-label {
            display: none;
          }
          
          .step-connector {
            width: 40px;
          }
        }
      `}</style>

      <div className="checkout-page-title">
        <div className="container">
          <h1>Checkout</h1>
          <div className="underline"></div>
        </div>
      </div>

      <div className="container">
        {state.length > 0 ? <ShowCheckout /> : <EmptyCart />}
      </div>
      
      <Footer />
    </>
  );
};

export default Checkout;