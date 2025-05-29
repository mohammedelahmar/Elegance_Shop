import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaReceipt } from 'react-icons/fa';
import { getOrderById, updateOrderToDelivered } from '../api/order';
import OrderDetail from '../components/Order/OrderDetail';
import Loader from '../components/UI/Loader';
import Message from '../components/UI/Message';
import './OrderPage.css';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [deliverError, setDeliverError] = useState(null);
  
  // This should be determined by your auth context/state
  const isAdmin = false; // Replace with actual admin check from your auth context
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);
  
  const handleMarkDelivered = async () => {
    if (!window.confirm('Mark this order as delivered?')) return;
    
    setDeliverLoading(true);
    try {
      const updatedOrder = await updateOrderToDelivered(orderId);
      setOrder(updatedOrder);
      setDeliverLoading(false);
    } catch (err) {
      setDeliverError(err.response?.data?.message || err.message);
      setDeliverLoading(false);
    }
  };
  return (
    <div className="order-page-container">
      <div className="order-page-content">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <FaArrowLeft />
          Back
        </button>
        
        <h1 className="order-page-title">
          <FaReceipt />
          Order Details
          {orderId && <span className="order-id-highlight">#{orderId.slice(-8).toUpperCase()}</span>}
        </h1>
        
        {loading ? (
          <div className="order-loading">
            <Loader />
          </div>
        ) : error ? (
          <div className="order-error">
            <Message variant="danger">{error}</Message>
          </div>
        ) : (
          <>
            {deliverError && <Message variant="danger">{deliverError}</Message>}
            <OrderDetail
              order={order}
              isAdmin={isAdmin}
              onMarkDelivered={handleMarkDelivered}
              deliverLoading={deliverLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPage;     