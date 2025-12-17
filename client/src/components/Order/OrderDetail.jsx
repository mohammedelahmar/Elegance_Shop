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

  const normalizedPaymentMethod =
    order.paymentMethod ||
    order.payment_method ||
    order.paymentType ||
    order.payment?.method ||
    order.paymentDetails?.method ||
    order.paymentInfo?.method ||
    order.payment_info?.method ||
    'Not specified';

  const normalizedItems = (
    order.orderItems ||
    order.items ||
    order.products ||
    order.cartItems ||
    []
  ).map((item, index) => {
    const quantity = item.quantity || item.qty || 1;
    const price = item.price ?? item.unitPrice ?? item.product?.price ?? item.product_id?.price ?? 0;
    const productId =
      item.product ||
      item.product_id?._id ||
      item.product_id ||
      item._id ||
      index;
    const name = item.name || item.product?.name || item.product_id?.name || 'Product';
    const image =
      item.image ||
      item.image_url ||
      item.product?.image_url ||
      item.product_id?.image_url ||
      'https://via.placeholder.com/120x120?text=Item';

    return {
      key: productId,
      name,
      image,
      quantity,
      price,
      total: quantity * (price || 0),
      link: `/product/${productId}`
    };
  });

  const statCards = [
    {
      label: 'Total Items',
      value: normalizedItems.length,
      icon: FaBoxOpen
    },
    {
      label: 'Order Total',
      value: `$${formatPrice(order.totalPrice || order.total_amount || order.total || 0)}`,
      icon: FaCalculator
    },
    {
      label: 'Payment Method',
      value: normalizedPaymentMethod,
      icon: FaCreditCard
    }
  ];
  
  return (
    <div className="order-detail-wrapper">
      <div className="order-detail-main">
        <div className="order-stats-grid">
          {statCards.map((stat, idx) => (
            <div key={idx} className="order-stat-card">
              <div className="stat-icon">
                <stat.icon />
              </div>
              <div className="stat-text">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

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
              <span className="info-value payment-pill">{normalizedPaymentMethod}</span>
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
          {!normalizedItems || normalizedItems.length === 0 ? (
            <div className="order-items-empty">
              <p>Order is empty</p>
            </div>
          ) : (
            <div className="order-items-list">
              {normalizedItems.map((item) => (
                <div key={item.key} className="order-item-card">
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
                        <Link to={item.link}>
                          {item.name}
                        </Link>
                      </h4>
                    </div>
                    <div className="item-pricing">
                      <div className="item-quantity">
                        Quantity: {item.quantity}
                      </div>
                      <div className="item-price">
                        ${formatPrice(item.price)} each
                      </div>
                      <div className="item-total">
                        Total: ${formatPrice(item.total)}
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