import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { FaEye } from 'react-icons/fa';

const OrderList = ({ orders, isAdmin = false }) => {
  if (!orders || orders.length === 0) {
    return <p className="text-center text-muted my-4">No orders found.</p>;
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
              <td>${formatPrice(order.total_amount || order.totalPrice)}</td>
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