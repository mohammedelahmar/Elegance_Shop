import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Tab, Tabs } from 'react-bootstrap';
import { FaSearch, FaSync, FaFileExport } from 'react-icons/fa';
import { getAllOrders, updateOrderToDelivered, updateOrderToPaid } from '../../api/order';
import OrderList from '../../components/Admin/Orders/OrderList';
import OrderDetail from '../../components/Admin/Orders/OrderDetail';
import OrderStats from '../../components/Admin/Orders/OrderStats';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import Message from '../../components/UI/Message';
import './OrdersPage.css'; // Import the new CSS for OrdersPage

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Order detail modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllOrders();
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refreshTrigger]);

  // Filter orders when tab changes or search term changes
  useEffect(() => {
    if (!orders.length) return;
    
    let result = [...orders];
    
    // Apply status filter based on active tab
    if (activeTab === 'unpaid') {
      result = result.filter(order => !order.isPaid);
    } else if (activeTab === 'paid') {
      result = result.filter(order => order.isPaid);
    } else if (activeTab === 'delivered') {
      result = result.filter(order => order.isDelivered);
    } else if (activeTab === 'processing') {
      result = result.filter(order => order.isPaid && !order.isDelivered);
    }
    
    // Apply search term if any
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        order => 
          order._id.toLowerCase().includes(term) ||
          (order.user && order.user.name && order.user.name.toLowerCase().includes(term)) ||
          (order.user && order.user.email && order.user.email.toLowerCase().includes(term)) ||
          (order.user_id && order.user_id.email && order.user_id.email.toLowerCase().includes(term))
      );
    }
    
    setFilteredOrders(result);
  }, [orders, activeTab, searchTerm]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const handleMarkDelivered = async (orderId) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        setActionLoading(true);
        setActionError(null);
        await updateOrderToDelivered(orderId);
        
        // Update the local state with the new data
        const updatedOrders = orders.map(order =>
          order._id === orderId ? { ...order, isDelivered: true, deliveredAt: new Date().toISOString() } : order
        );
        setOrders(updatedOrders);
        setFilteredOrders(prevFiltered => prevFiltered.map(order =>
          order._id === orderId ? { 
            ...order, 
            isDelivered: true, 
            deliveredAt: new Date().toISOString() 
          } : order
        ));
        
        // If we're viewing the order details, update the selected order too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            isDelivered: true,
            deliveredAt: new Date().toISOString()
          });
        }
      } catch (err) {
        setActionError(err.response?.data?.message || err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleMarkPaid = async (orderId) => {
    if (window.confirm('Mark this order as paid?')) {
      try {
        setActionLoading(true);
        setActionError(null);
        
        // Call API to mark as paid
        await updateOrderToPaid(orderId);
        
        // Update the local state with the new data
        const updatedOrders = orders.map(order =>
          order._id === orderId ? { 
            ...order, 
            isPaid: true, 
            paidAt: new Date().toISOString() 
          } : order
        );
        setOrders(updatedOrders);
        setFilteredOrders(prevFiltered => prevFiltered.map(order =>
          order._id === orderId ? { 
            ...order, 
            isPaid: true, 
            paidAt: new Date().toISOString() 
          } : order
        ));
        
        // If we're viewing the order details, update the selected order too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            isPaid: true,
            paidAt: new Date().toISOString()
          });
        }
      } catch (err) {
        setActionError(err.response?.data?.message || err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleExportOrders = () => {
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

    // Generate CSV content from filtered orders
    const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Total', 'Paid', 'Delivered'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => {
        // Handle different user field structures
        let userName = 'Unknown User';
        let userEmail = '-';
        
        if (order.user_id) {
          userName = `${order.user_id.Firstname || ''} ${order.user_id.Lastname || ''}`.trim();
          userEmail = order.user_id.email || '-';
        } else if (order.user) {
          userName = order.user.name || 'Unknown User';
          userEmail = order.user.email || '-';
        }
        
        return [
          order._id,
          userName,
          userEmail,
          new Date(order.createdAt).toLocaleDateString(),
          formatPrice(order.totalPrice || order.total_amount),
          order.isPaid ? 'Yes' : 'No',
          order.isDelivered ? 'Yes' : 'No'
        ].join(',');
      })
    ].join('\n');
    
    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="orders-admin-container"> {/* Apply new container class */}
      {/* Header Row */}
      <div className="orders-admin-header mb-4 d-flex justify-content-between align-items-center">
        <h1 className="orders-admin-title">Order Management</h1>
        <div className="orders-admin-actions">
          <Button 
            variant="outline-success" 
            className="me-2" 
            onClick={handleExportOrders}
            disabled={filteredOrders.length === 0}
          >
            <FaFileExport /> Export CSV
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={handleRefresh}
          >
            <FaSync /> Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {!loading && !error && (
        <OrderStats orders={orders} className="mb-4" />
      )}

      {/* Search and Filters wrapped in a card-like div */}
      <div className="orders-list-card mb-4">
        <div className="order-search-bar mb-4">
          <InputGroup>
            <InputGroup.Text id="search-addon" className="order-search-icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Search"
              aria-describedby="search-addon"
              className="order-search-input"
            />
          </InputGroup>
          <div className="mt-2 text-muted small text-end">
            <strong>Total:</strong> {filteredOrders.length} orders
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs 
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 order-tabs" // Apply new tabs class
        >
          <Tab eventKey="all" title="All Orders" />
          <Tab eventKey="unpaid" title="Unpaid" />
          <Tab eventKey="paid" title="Paid" />
          <Tab eventKey="processing" title="Processing" />
          <Tab eventKey="delivered" title="Delivered" />
        </Tabs>
      </div>

      {/* Action Error Message */}
      {actionError && (
        <Message 
          variant="danger" 
          dismissible 
          onClose={() => setActionError(null)}
          className="mb-4"
        >
          {actionError}
        </Message>
      )}

      {/* Orders List - Using IIFE pattern for cleaner conditional rendering */}
      {(() => {
        if (loading) {
          return <LoadingAnimation size="large" text="Loading orders..." />;
        }
        
        if (error) {
          return <Message variant="danger">{error}</Message>;
        }
        
        if (filteredOrders.length === 0) {
          return (
            <div className="text-center p-5">
              <h3 className="text-muted">No orders found</h3>
              <p>No orders match your current filters.</p>
            </div>
          );
        }
        
        return (
          // Wrap OrderList in a card-like div if it isn't already styled internally
          <div className="orders-list-card">
            <OrderList
              orders={filteredOrders}
              onViewOrder={handleViewOrder}
              onMarkPaid={handleMarkPaid}
              onMarkDelivered={handleMarkDelivered}
              isLoading={actionLoading}
            />
          </div>
        );
      })()}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          show={showOrderDetail}
          onHide={handleCloseOrderDetail}
          onMarkDelivered={handleMarkDelivered}
          onMarkPaid={handleMarkPaid}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default OrdersPage;