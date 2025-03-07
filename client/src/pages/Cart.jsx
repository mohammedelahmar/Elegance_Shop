import React from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const addItem = (product) => {
    dispatch(addCart(product));
  };
  
  const removeItem = (product) => {
    dispatch(delCart(product));
  };

  const EmptyCart = () => {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="continue-shopping-btn">
            <i className="fas fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    );
  };

  const ShowCart = () => {
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
      <div className="cart-container">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="cart-items-card">
                <div className="card-header">
                  <h3>Shopping Cart <span>({totalItems} items)</span></h3>
                </div>
                <div className="card-body">
                  {state.map((item) => {
                    // Ensure price and quantity are numbers
                    const price = Number(item.price) || 0;
                    const qty = Number(item.quantity) || 1;
                    const itemTotal = price * qty;
                    
                    return (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-image">
                          <img src={item.image} alt={item.title} />
                        </div>
                        <div className="cart-item-details">
                          <h4 className="item-title">{item.title}</h4>
                          <div className="item-meta">
                            {item.size && (
                              <span className="item-size">Size: {item.size}</span>
                            )}
                            <span className="item-category">{item.category}</span>
                          </div>
                          <div className="item-price">${price.toFixed(2)}</div>
                        </div>
                        <div className="cart-item-actions">
                          <div className="quantity-selector">
                            <button 
                              className="qty-btn minus" 
                              onClick={() => removeItem(item)}
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                            <span className="quantity">{qty}</span>
                            <button 
                              className="qty-btn plus" 
                              onClick={() => addItem(item)}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                          <div className="item-subtotal">
                            ${itemTotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="card-footer">
                  <Link to="/" className="continue-shopping">
                    <i className="fas fa-arrow-left"></i> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="order-summary-card">
                <div className="card-header">
                  <h3>Order Summary</h3>
                </div>
                <div className="card-body">
                  <div className="summary-item">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <span>${(subtotal + shipping).toFixed(2)}</span>
                  </div>
                  
                  <Link to="/checkout" className="checkout-btn">
                    Proceed to Checkout <i className="fas fa-arrow-right"></i>
                  </Link>
                  
                  <div className="secure-checkout">
                    <i className="fas fa-lock"></i> Secure Checkout
                  </div>
                  
                  <div className="payment-methods">
                    <div className="payment-title">We Accept</div>
                    <div className="payment-icons">
                      <i className="fab fa-cc-visa"></i>
                      <i className="fab fa-cc-mastercard"></i>
                      <i className="fab fa-cc-amex"></i>
                      <i className="fab fa-cc-paypal"></i>
                    </div>
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
        /* Cart Page Styles */
        .cart-page-title {
          padding: 3rem 0 1.5rem;
          text-align: center;
        }
        
        .cart-page-title h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        
        .cart-page-title .underline {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          margin: 0 auto;
        }
        
        /* Empty Cart Styles */
        .empty-cart {
          background: #f8fafc;
          padding: 5rem 0;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .empty-cart-content {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .empty-cart-icon {
          font-size: 5rem;
          color: #cbd5e1;
          margin-bottom: 2rem;
        }
        
        .empty-cart h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        
        .empty-cart p {
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
        
        /* Cart Container Styles */
        .cart-container {
          padding: 2rem 0 4rem;
        }
        
        /* Cart Items Card */
        .cart-items-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-bottom: 2rem;
        }
        
        .cart-items-card .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .cart-items-card .card-header h3 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
          display: flex;
          align-items: center;
        }
        
        .cart-items-card .card-header h3 span {
          color: #64748b;
          font-size: 1.1rem;
          margin-left: 0.5rem;
        }
        
        .cart-items-card .card-body {
          padding: 0;
        }
        
        .cart-item {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          position: relative;
        }
        
        .cart-item:last-child {
          border-bottom: none;
        }
        
        .cart-item-image {
          width: 100px;
          height: 100px;
          background: #f8fafc;
          border-radius: 8px;
          overflow: hidden;
          margin-right: 1.5rem;
          padding: 0.5rem;
        }
        
        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .cart-item-details {
          flex: 1;
          padding-right: 2rem;
        }
        
        .item-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .item-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .item-size, .item-category {
          font-size: 0.85rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
        }
        
        .item-price {
          font-weight: 600;
          color: #0f172a;
        }
        
        .cart-item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .qty-btn {
          background: #f8fafc;
          border: none;
          height: 36px;
          width: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: all 0.2s ease;
        }
        
        .qty-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        
        .quantity {
          width: 40px;
          text-align: center;
          font-weight: 500;
          color: #0f172a;
        }
        
        .item-subtotal {
          font-weight: 600;
          font-size: 1.1rem;
          color: #0f172a;
        }
        
        .cart-items-card .card-footer {
          padding: 1.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-start;
        }
        
        .continue-shopping {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .continue-shopping:hover {
          color: #0f172a;
        }
        
        /* Order Summary Card */
        .order-summary-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          position: sticky;
          top: 2rem;
        }
        
        .order-summary-card .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .order-summary-card .card-header h3 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }
        
        .order-summary-card .card-body {
          padding: 1.5rem;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          color: #475569;
        }
        
        .summary-total {
          display: flex;
          justify-content: space-between;
          padding-top: 1rem;
          margin: 1.5rem 0;
          border-top: 1px solid #e2e8f0;
          font-weight: 600;
          font-size: 1.2rem;
          color: #0f172a;
        }
        
        .checkout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .checkout-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          color: white;
        }
        
        .secure-checkout {
          text-align: center;
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .payment-methods {
          border-top: 1px solid #e2e8f0;
          padding-top: 1.5rem;
        }
        
        .payment-title {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .payment-icons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          font-size: 2rem;
          color: #64748b;
        }
        
        /* Responsive Styles */
        @media (max-width: 992px) {
          .cart-item {
            flex-wrap: wrap;
          }
          
          .cart-item-details {
            width: calc(100% - 120px);
          }
          
          .cart-item-actions {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 1rem;
            padding-left: 120px;
          }
        }
        
        @media (max-width: 768px) {
          .cart-item-image {
            width: 80px;
            height: 80px;
            margin-right: 1rem;
          }
          
          .cart-item-details {
            width: calc(100% - 90px);
          }
          
          .cart-item-actions {
            padding-left: 90px;
          }
          
          .item-title {
            font-size: 1rem;
          }
        }
        
        @media (max-width: 576px) {
          .cart-page-title h1 {
            font-size: 2rem;
          }
          
          .cart-item-image {
            width: 70px;
            height: 70px;
          }
          
          .cart-item-details {
            width: calc(100% - 80px);
          }
          
          .cart-item-actions {
            padding-left: 0;
          }
          
          .empty-cart-icon {
            font-size: 4rem;
          }
          
          .empty-cart h2 {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <div className="cart-page-title">
        <div className="container">
          <h1>Shopping Cart</h1>
          <div className="underline"></div>
        </div>
      </div>

      <div className="container">
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      
      <Footer />
    </>
  );
};

export default Cart;