import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaEye, FaCheckCircle, FaTimes, FaClock, FaTruck } from 'react-icons/fa';
import { getMyOrders } from '../api/order';
import Message from '../components/UI/Message';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add this helper function to safely handle price formatting
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  return (
    <div className="order-history-page">
      <div className="order-history-container">
        <h1 className="order-history-title">Order History</h1>
        
        {loading ? (
          <div className="order-history-content">
            <div className="order-history-loading">
              <div className="loading-spinner"></div>
              Loading your orders...
            </div>
          </div>
        ) : error ? (
          <div className="order-history-content">
            <div className="order-history-error">
              <Message variant="danger">{error}</Message>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="order-history-content">
            <div className="order-history-empty">
              <div className="empty-icon">
                <FaShoppingBag />
              </div>
              <h2 className="empty-title">No Orders Found</h2>
              <p className="empty-message">
                You haven't placed any orders yet. Start shopping to build your order history!
              </p>
              <Link to="/products" className="start-shopping-btn">
                <FaShoppingBag />
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="order-history-content">
            <div className="order-history-header">
              <h2>
                <FaShoppingBag />
                Your Orders
                <span className="orders-count-badge">{orders.length}</span>
              </h2>
            </div>
            <div className="order-history-body">
              {/* Desktop Table */}
              <div className="desktop-table">
                <table className="order-history-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Delivery</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="order-id-cell">#{order._id.slice(-8).toUpperCase()}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="order-total">
                          ${formatPrice(order.totalPrice || order.total_amount)}
                        </td>
                        <td>
                          {order.isPaid ? (
                            <span className="status-paid">
                              <FaCheckCircle />
                              {new Date(order.paidAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="status-not-paid">
                              <FaTimes />
                              Not Paid
                            </span>
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            <span className="status-delivered">
                              <FaTruck />
                              {new Date(order.deliveredAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="status-not-delivered">
                              <FaClock />
                              Pending
                            </span>
                          )}
                        </td>
                        <td>
                          <Link
                            to={`/order/${order._id}`}
                            className="order-details-btn"
                          >
                            <FaEye />
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="mobile-order-cards">
                {orders.map((order) => (
                  <div key={order._id} className="mobile-order-card">
                    <div className="mobile-card-header">
                      <div className="mobile-order-id">#{order._id.slice(-8).toUpperCase()}</div>
                      <div className="mobile-order-date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mobile-card-details">
                      <div className="mobile-detail-row">
                        <span className="mobile-detail-label">Total</span>
                        <span className="mobile-detail-value order-total">
                          ${formatPrice(order.totalPrice || order.total_amount)}
                        </span>
                      </div>
                      <div className="mobile-detail-row">
                        <span className="mobile-detail-label">Payment</span>
                        <span className={`mobile-detail-value ${order.isPaid ? 'status-paid' : 'status-not-paid'}`}>
                          {order.isPaid ? (
                            <>
                              <FaCheckCircle />
                              Paid
                            </>
                          ) : (
                            <>
                              <FaTimes />
                              Not Paid
                            </>
                          )}
                        </span>
                      </div>
                      <div className="mobile-detail-row">
                        <span className="mobile-detail-label">Delivery</span>
                        <span className={`mobile-detail-value ${order.isDelivered ? 'status-delivered' : 'status-not-delivered'}`}>
                          {order.isDelivered ? (
                            <>
                              <FaTruck />
                              Delivered
                            </>
                          ) : (
                            <>
                              <FaClock />
                              Pending
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/order/${order._id}`}
                      className="order-details-btn"
                    >
                      <FaEye />
                      View Details
                    </Link>                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;