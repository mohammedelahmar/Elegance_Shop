import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaShoppingBag, FaCheckCircle, FaClock, FaTimes, FaTruck } from 'react-icons/fa';
import './OrderList.css';

const OrderList = ({ orders, isAdmin = false, loading = false }) => {
  // Loading state
  if (loading) {
    return (
      <div className="profile-orders-container">
        <div className="orders-header">
          <h3>
            <FaShoppingBag />
            My Orders
          </h3>
        </div>
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          Loading your orders...
        </div>
      </div>
    );
  }
  if (!orders || orders.length === 0) {
    return (
      <div className="profile-orders-container">
        <div className="orders-header">
          <h3>
            <FaShoppingBag />
            My Orders
            <span className="orders-count">0</span>
          </h3>
        </div>        <div className="orders-empty-state">
          <div className="empty-state-icon">
            <FaShoppingBag />
          </div>
          <h4 className="empty-state-title">No Orders Found</h4>
          <p className="empty-state-message">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <div className="empty-state-cta">
            <Link to="/products" className="empty-state-btn">
              <FaShoppingBag />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to safely format price values
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatusBadge = ({ type, isTrue, trueText, falseText, trueDate }) => {
    const isPositive = isTrue;
    const text = isTrue ? (trueDate ? formatDate(trueDate) : trueText) : falseText;
    
    let icon, className;
    if (type === 'payment') {
      icon = isPositive ? <FaCheckCircle className="status-icon" /> : <FaTimes className="status-icon" />;
      className = isPositive ? 'status-badge paid' : 'status-badge unpaid';
    } else {
      icon = isPositive ? <FaTruck className="status-icon" /> : <FaClock className="status-icon" />;
      className = isPositive ? 'status-badge delivered' : 'status-badge pending';
    }

    return (
      <span className={className}>
        {icon}
        {text}
      </span>
    );
  };

  return (
    <div className="profile-orders-container">
      <div className="orders-header">
        <h3>
          <FaShoppingBag />
          My Orders
          <span className="orders-count">{orders.length}</span>
        </h3>
      </div>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div className="order-id">
                #{order._id.slice(-8).toUpperCase()}
              </div>
              <div className="order-date">
                {formatDate(order.createdAt)}
              </div>
            </div>            <div className="order-details">
              <div className="order-detail-item">
                <span className="order-detail-label">Total Amount</span>
                <span className="order-detail-value order-amount">
                  ${formatPrice(order.total_amount || order.totalPrice)}
                </span>
              </div>
              
              <div className="order-detail-item">
                <span className="order-detail-label">Items</span>
                <span className="order-detail-value">
                  {order.orderItems ? order.orderItems.length : order.items?.length || 'N/A'} item{order.orderItems?.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {isAdmin && (
                <div className="order-detail-item">
                  <span className="order-detail-label">Customer</span>
                  <span className="order-detail-value">
                    {order.user ? order.user.name : 'Deleted User'}
                  </span>
                </div>
              )}
              
              {!isAdmin && (
                <div className="order-detail-item">
                  <span className="order-detail-label">Order ID</span>
                  <span className="order-detail-value">
                    {order._id.slice(-6)}
                  </span>
                </div>
              )}
            </div>

            <div className="order-status-badges">
              <StatusBadge
                type="payment"
                isTrue={order.isPaid}
                trueText="Paid"
                falseText="Unpaid"
                trueDate={order.paidAt}
              />
              <StatusBadge
                type="delivery"
                isTrue={order.isDelivered}
                trueText="Delivered"
                falseText="Pending"
                trueDate={order.deliveredAt}
              />
            </div>

            <div className="order-actions">
              <Link
                to={`/order/${order._id}`}
                className="view-order-btn"
              >
                <FaEye />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;