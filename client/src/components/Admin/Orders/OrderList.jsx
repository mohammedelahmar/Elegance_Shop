import React from 'react';
import { Table, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { FaEye, FaCheck, FaTruck } from 'react-icons/fa';
import PropTypes from 'prop-types';

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
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead className="bg-light">
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
                <div>{order.user_id?.Firstname || ''} {order.user_id?.Lastname || 'Guest'}</div>
                <small className="text-muted">{order.user_id?.email}</small>
              </td>
              <td>${formatPrice(order.totalPrice || order.total_amount)}</td>
              <td>
                {order.isPaid ? (
                  <Badge bg="success">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge bg="warning" text="dark">
                    Pending
                  </Badge>
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  <Badge bg="success">
                    Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge bg="warning" text="dark">
                    Not Delivered
                  </Badge>
                )}
              </td>
              <td>
                <ButtonGroup>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onViewOrder(order)}
                    title="View Order Details"
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