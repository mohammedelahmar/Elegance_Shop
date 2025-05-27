import React from 'react';
import { Table, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { FaEye, FaCheck, FaTruck } from 'react-icons/fa';
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
  return (
    <div className="order-list-container table-responsive"> {/* Added order-list-container */}
      <Table hover className="align-middle order-table"> {/* Added order-table class */}
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Delivery</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <strong>{order._id.substring(order._id.length - 8)}</strong>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="customer-name">{order.user_id?.Firstname || ''} {order.user_id?.Lastname || 'Guest'}</div>
                <small className="text-muted">{order.user_id?.email}</small>
              </td>
              <td>${formatPrice(order.totalPrice || order.total_amount)}</td>
              <td>
                {order.isPaid ? (
                  <Badge bg="success" className="status-badge">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge bg="warning" text="dark" className="status-badge">
                    Pending
                  </Badge>
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  <Badge bg="success" className="status-badge">
                    Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge bg="warning" text="dark" className="status-badge">
                    Not Delivered
                  </Badge>
                )}
              </td>
              <td>
                <ButtonGroup className="action-buttons">
                  <Button
                    variant="outline-primary" // Will be styled by CSS
                    size="sm"
                    onClick={() => onViewOrder(order)}
                    title="View Order Details"
                    className="action-button view-button"
                  >
                    <FaEye />
                  </Button>
                  {!order.isPaid && (
                    <Button
                      variant="outline-success" // Will be styled by CSS
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
                      variant="outline-info" // Will be styled by CSS
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
          ))}
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