import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { FaEye } from 'react-icons/fa';

const OrderList = ({ orders, isAdmin = false }) => {
  if (!orders || orders.length === 0) {
    return <p className="text-center text-muted my-4">No orders found.</p>;
  }

  return (
    <div className="table-responsive">
      <Table hover bordered className="align-middle">
        <thead className="bg-light">
          <tr>
            <th>ID</th>
            {isAdmin && <th>CUSTOMER</th>}
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-6)}</td>
              {isAdmin && (
                <td>
                  {order.user ? order.user.name : 'Deleted User'}
                </td>
              )}
              <td>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>
                {order.isPaid ? (
                  <Badge bg="success">
                    {new Date(order.paidAt).toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge bg="danger">
                    Unpaid
                  </Badge>
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  <Badge bg="success">
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge bg="warning" text="dark">
                    Pending
                  </Badge>
                )}
              </td>
              <td>
                <Button
                  as={Link}
                  to={`/order/${order._id}`}
                  size="sm"
                  variant="primary"
                  icon={FaEye}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderList;