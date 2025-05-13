import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/order';
import Loader from '../components/UI/Loader';
import Message from '../components/UI/Message';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <Message>You have no orders</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">ID</th>
                <th className="py-3 px-4 border-b text-left">DATE</th>
                <th className="py-3 px-4 border-b text-left">TOTAL</th>
                <th className="py-3 px-4 border-b text-left">PAID</th>
                <th className="py-3 px-4 border-b text-left">DELIVERED</th>
                <th className="py-3 px-4 border-b text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{order._id}</td>
                  <td className="py-3 px-4 border-b">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b">
                    ${formatPrice(order.totalPrice || order.total_amount)}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {order.isPaid ? (
                      new Date(order.paidAt).toLocaleDateString()
                    ) : (
                      <span className="text-red-500">Not Paid</span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {order.isDelivered ? (
                      new Date(order.deliveredAt).toLocaleDateString()
                    ) : (
                      <span className="text-red-500">Not Delivered</span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <Link
                      to={`/order/${order._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;