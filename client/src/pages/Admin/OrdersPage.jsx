import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../api/order';
import OrderList from '../../components/Order/OrderList';
import Loader from '../../components/UI/Loader';
import Message from '../../components/UI/Message';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
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
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <OrderList orders={orders} isAdmin={true} />
      )}
    </div>
  );
};

export default OrdersPage;