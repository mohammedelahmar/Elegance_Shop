import React from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaCreditCard, FaShippingFast, FaBoxOpen, FaCalculator } from 'react-icons/fa';
import Button from '../UI/Button';
import './OrderDetail.css';

// Add this helper function at the top
const formatPrice = (price) => {
  if (!price) return '0.00';
  
  // Handle MongoDB Decimal128 format
  if (typeof price === 'object' && price.$numberDecimal) {
    return parseFloat(price.$numberDecimal).toFixed(2);
  }
  
  // Handle regular number or string
  try {
    return parseFloat(price).toFixed(2);
  } catch (e) {
    return '0.00';
  }
};

const OrderDetail = ({ order, isAdmin, onMarkDelivered, deliverLoading }) => {
  if (!order) return null;
  
  return (
    <div className="order-detail-wrapper">
      <div className="order-detail-main">
        {/* Shipping and Payment Information */}
        <div className="shipping-payment-grid">
          <div className="info-section">
            <h3>
              <FaShippingFast />
              Shipping Information
            </h3>
            <div className="info-item">
              <span className="info-label">Customer Name:</span>
              <span className="info-value">{order.user?.name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">
                {order.user?.email ? (
                  <a href={`mailto:${order.user.email}`}>
                    {order.user.email}
                  </a>
                ) : (
                  'N/A'
                )}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Address:</span>
              <span className="info-value address-text">
                {order.shippingAddress ? (
                  <>
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </>
                ) : (
                  'Shipping information unavailable'
                )}
              </span>
            </div>
            <div className={`status-indicator ${order.isDelivered ? 'status-delivered' : 'status-not-delivered'}`}>
              {order.isDelivered ? (
                <>Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</>
              ) : (
                'Not Delivered'
              )}
            </div>
          </div>
          
          <div className="info-section">
            <h3>
              <FaCreditCard />
              Payment Information
            </h3>
            <div className="info-item">
              <span className="info-label">Payment Method:</span>
              <span className="info-value">{order.paymentMethod || 'Not specified'}</span>
            </div>
            <div className={`status-indicator ${order.isPaid ? 'status-paid' : 'status-not-paid'}`}>
              {order.isPaid ? (
                <>Paid on {new Date(order.paidAt).toLocaleDateString()}</>
              ) : (
                'Not Paid'
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h3 className="order-items-title">
            <FaBoxOpen />
            Order Items
          </h3>
          {!order.orderItems || order.orderItems.length === 0 ? (
            <div className="order-items-empty">
              <p>Order is empty</p>
            </div>
          ) : (
            <div className="order-items-list">
              {order.orderItems.map((item, index) => (
                <div key={index} className="order-item-card">
                  <div className="item-content">
                    <div className="item-image-container">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-image"
                      />
                    </div>
                    <div className="item-info">
                      <h4>
                        <Link to={`/product/${item.product}`}>
                          {item.name || 'Product'}
                        </Link>
                      </h4>
                    </div>
                    <div className="item-pricing">
                      <div className="item-quantity">
                        Quantity: {item.quantity || 1}
                      </div>
                      <div className="item-price">
                        ${formatPrice(item.price)} each
                      </div>
                      <div className="item-total">
                        Total: ${formatPrice((item.quantity || 1) * (item.price || 0))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3 className="summary-title">
            <FaCalculator />
            Order Summary
          </h3>
          <div className="summary-item">
            <span className="summary-label">Items:</span>
            <span className="summary-value">${formatPrice(order.itemsPrice)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Shipping:</span>
            <span className="summary-value">${formatPrice(order.shippingPrice)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Tax:</span>
            <span className="summary-value">${formatPrice(order.taxPrice)}</span>
          </div>
          <div className="summary-total">
            <span>Total:</span>
            <span>${formatPrice(order.totalPrice || order.total_amount)}</span>
          </div>
          
          {isAdmin && order.isPaid && !order.isDelivered && (
            <div className="admin-actions">
              <Button
                variant="success"
                onClick={onMarkDelivered}
                isLoading={deliverLoading}
                fullWidth
                icon={FaTruck}
                className="deliver-button"
              >
                Mark As Delivered
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;