import React from 'react';
import { Table, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { FaEye, FaCheck, FaTruck, FaEnvelope, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './OrderList.css'; // Import the CSS file

// Helper function to safely format price values
const formatPrice = (price) => {
  if (!price && price !== 0) return '0.00';
  
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

const OrderList = ({ orders, onViewOrder, onMarkPaid, onMarkDelivered, isLoading }) => {
  const getInitials = (first, last) => {
    const f = first?.[0] || '';
    const l = last?.[0] || '';
    return `${f}${l}` || 'G';
  };

  return (
    <div className="order-list-container table-responsive">
      <Table hover className="align-middle order-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Delivery</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const first = order.user_id?.Firstname || '';
            const last = order.user_id?.Lastname || 'Guest';
            const email = order.user_id?.email || 'No email';
            return (
              <tr key={order._id}>
                <td>
                  <div className="order-id-block">
                    <span className="order-pill">#{order._id.substring(order._id.length - 8)}</span>
                    <span className="order-date"><FaCalendarAlt /> {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td>
                  <div className="customer-block">
                    <div className="avatar-circle">{getInitials(first, last)}</div>
                    <div>
                      <div className="customer-name">{first} {last}</div>
                      <div className="customer-email"><FaEnvelope /> {email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="total-chip">
                    <FaDollarSign /> ${formatPrice(order.totalPrice || order.total_amount)}
                  </div>
                </td>
                <td>
                  {order.isPaid ? (
                    <Badge bg="success" className="status-badge modern">
                      Paid • {new Date(order.paidAt).toLocaleDateString()}
                    </Badge>
                  ) : (
                    <Badge bg="warning" text="dark" className="status-badge modern">
                      Pending
                    </Badge>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <Badge bg="success" className="status-badge modern">
                      Delivered • {new Date(order.deliveredAt).toLocaleDateString()}
                    </Badge>
                  ) : (
                    <Badge bg="warning" text="dark" className="status-badge modern">
                      Not Delivered
                    </Badge>
                  )}
                </td>
                <td>
                  <ButtonGroup className="action-buttons">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onViewOrder(order)}
                      title="View Order Details"
                      className="action-button view-button"
                    >
                      <FaEye />
                    </Button>
                    {!order.isPaid && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => onMarkPaid(order._id)}
                        disabled={isLoading}
                        title="Mark as Paid"
                        className="action-button paid-button"
                      >
                        <FaCheck />
                      </Button>
                    )}
                    {order.isPaid && !order.isDelivered && (
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => onMarkDelivered(order._id)}
                        disabled={isLoading}
                        title="Mark as Delivered"
                        className="action-button delivered-button"
                      >
                        <FaTruck />
                      </Button>
                    )}
                  </ButtonGroup>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  onViewOrder: PropTypes.func.isRequired,
  onMarkPaid: PropTypes.func.isRequired,
  onMarkDelivered: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default OrderList;