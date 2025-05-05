import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Tab, Tabs } from 'react-bootstrap';
import { FaSearch, FaSync, FaFileExport } from 'react-icons/fa';
import { getAllOrders, updateOrderToDelivered, updateOrderToPaid } from '../../api/order';
import OrderList from '../../components/Admin/Orders/OrderList';
import OrderDetail from '../../components/Admin/Orders/OrderDetail';
import OrderStats from '../../components/Admin/Orders/OrderStats';
import Loader from '../../components/UI/Loader';
import Message from '../../components/UI/Message';
import '../../components/Admin/Categories/CategoryList.css'; // Use the same CSS as CategoryList for consistent style

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
    async function fetchOrders() {
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
    }
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
          (order.user && order.user.email && order.user.email.toLowerCase().includes(term))
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
        await updateOrderToPaid(orderId, { id: Date.now(), status: 'COMPLETED', update_time: new Date().toISOString(), payer: { email_address: 'manual@admin.com' } });
        
        // Update the local state with the new data
        const updatedOrders = orders.map(order =>
          order._id === orderId ? { ...order, isPaid: true, paidAt: new Date().toISOString() } : order
        );
        setOrders(updatedOrders);
        
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
    // Generate CSV content from filtered orders
    const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Total', 'Paid', 'Delivered'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order._id,
        order.user?.name || 'Unknown User',
        order.user?.email || '-',
        new Date(order.createdAt).toLocaleDateString(),
        order.totalPrice.toFixed(2),
        order.isPaid ? 'Yes' : 'No',
        order.isDelivered ? 'Yes' : 'No'
      ].join(','))
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
    <div className="category-list-card"> {/* Use same card class as CategoryList */}
      {/* Header Row */}
      <div className="categories-admin-header mb-4 d-flex justify-content-between align-items-center">
        <h1 className="categories-admin-title">Order Management</h1>
        <div className="categories-admin-actions">
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

      {/* Search and Filters */}
      <div className="category-search-bar mb-4">
        <InputGroup>
          <InputGroup.Text id="search-addon" className="category-search-icon">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search"
            aria-describedby="search-addon"
            className="category-search-input"
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
        className="mb-4"
      >
        <Tab eventKey="all" title="All Orders" />
        <Tab eventKey="unpaid" title="Unpaid" />
        <Tab eventKey="paid" title="Paid" />
        <Tab eventKey="processing" title="Processing" />
        <Tab eventKey="delivered" title="Delivered" />
      </Tabs>

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

      {/* Orders List */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center p-5">
          <h3 className="text-muted">No orders found</h3>
          <p>No orders match your current filters.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <OrderList
            orders={filteredOrders}
            onViewOrder={handleViewOrder}
            onMarkPaid={handleMarkPaid}
            onMarkDelivered={handleMarkDelivered}
            isLoading={actionLoading}
          />
        </div>
      )}

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