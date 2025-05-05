import React from 'react';
import { Badge, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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

const RecentOrders = ({ orders }) => {
  if (!orders.length) {
    return <p className="text-muted text-center">No recent orders</p>;
  }
  
  return (
    <ListGroup variant="flush">
      {orders.map(order => (
        <ListGroup.Item 
          key={order._id} 
          className="d-flex justify-content-between align-items-center py-3 px-0 border-bottom"
        >
          <div>
            <p className="mb-0 fw-medium">
              <Link 
                to={`/admin/orders/${order._id}`} 
                className="text-decoration-none"
              >
                #{order._id.substring(order._id.length - 6).toUpperCase()}
              </Link>
            </p>
            <small className="text-muted">
              {new Date(order.createdAt).toLocaleDateString()}
            </small>
            <div>
              <small>
                By {order.user_id?.Firstname || ''} {order.user_id?.Lastname || ''}
              </small>
            </div>
          </div>
          
          <div className="text-end">
            <div>${formatPrice(order.totalPrice || order.total_amount)}</div>
            <div>
              {order.isPaid ? (
                order.isDelivered ? (
                  <Badge bg="success">Delivered</Badge>
                ) : (
                  <Badge bg="primary">Processing</Badge>
                )
              ) : (
                <Badge bg="warning" text="dark">Pending</Badge>
              )}
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

RecentOrders.propTypes = {
  orders: PropTypes.array.isRequired
};

export default RecentOrders;