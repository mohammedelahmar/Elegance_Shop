import React from 'react';
import { Table, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { FaEye, FaCheck, FaTruck } from 'react-icons/fa';
import PropTypes from 'prop-types';

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
                <div>{order.user?.name || 'Guest'}</div>
                <small className="text-muted">{order.user?.email}</small>
              </td>
              <td>${order.totalPrice.toFixed(2)}</td>
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