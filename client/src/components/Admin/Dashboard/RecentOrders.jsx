import React from 'react';
import { Badge, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
                {order.user?.Firstname} {order.user?.Lastname}
              </small>
            </div>
          </div>
          
          <div className="text-end">
            <div>${order.totalPrice.toFixed(2)}</div>
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