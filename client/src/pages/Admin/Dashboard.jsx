import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaShoppingCart, FaUsers, FaBox, FaMoneyBillWave, 
  FaStar, FaBoxOpen, FaShippingFast, FaExclamationTriangle, FaTags
} from 'react-icons/fa';
import { getAllOrders } from '../../api/order';
import { getAllProducts } from '../../api/product';
import { getAllUsers } from '../../api/user';
import { getAllReviews } from '../../api/review';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import Message from '../../components/UI/Message';
import RecentOrders from '../../components/Admin/Dashboard/RecentOrders';
import SalesChart from '../../components/Admin/Dashboard/SalesChart';
import TopProducts from '../../components/Admin/Dashboard/TopProducts';
import RecentReviews from '../../components/Admin/Dashboard/RecentReviews';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeaderBar from '../../components/Admin/AdminHeaderBar';
import './DashboardLayout.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    ordersTotal: 0,
    ordersProcessing: 0,
    revenue: 0,
    usersTotal: 0,
    productsTotal: 0,
    productsOutOfStock: 0,
    reviewsTotal: 0,
    reviewsPending: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all necessary data
        const [orders, products, users, reviews] = await Promise.all([
          getAllOrders(),
          getAllProducts({ limit: 100 }),
          getAllUsers(),
          getAllReviews()
        ]);

        // Calculate statistics
        const totalRevenue = orders
          .filter(order => order.isPaid)
          .reduce((sum, order) => {
            let price = 0;
            if (order.totalPrice) {
              if (typeof order.totalPrice === 'object' && order.totalPrice.$numberDecimal) {
                price = parseFloat(order.totalPrice.$numberDecimal);
              } else {
                price = parseFloat(order.totalPrice) || 0;
              }
            } else if (order.total_amount) {
              if (typeof order.total_amount === 'object' && order.total_amount.$numberDecimal) {
                price = parseFloat(order.total_amount.$numberDecimal);
              } else {
                price = parseFloat(order.total_amount) || 0;
              }
            }
            return sum + price;
          }, 0);
        
        const processingOrders = orders.filter(
          order => order.isPaid && !order.isDelivered
        );

        const outOfStockProducts = products.products.filter(
          product => product.stock_quantity === 0
        );

        const pendingReviews = reviews.data.filter(
          review => !review.approved
        );

        // Set recent orders (last 5)
        const sortedOrders = [...orders].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Generate sales data for the chart (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const salesByDay = last7Days.map(day => {
          const dayOrders = orders.filter(order => {
            return order.isPaid && order.createdAt.split('T')[0] === day;
          });
          const daySales = dayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
          return { date: day, sales: daySales };
        });

        // Find top selling products
        const productSales = {};
        orders.forEach(order => {
          if (!order.isPaid) return;
          
          // Skip if orderItems is undefined or not an array
          if (!order.orderItems || !Array.isArray(order.orderItems)) return;
          
          order.orderItems.forEach(item => {
            const productId = item.product_id || item.product || 'unknown';
            if (!productSales[productId]) {
              productSales[productId] = {
                quantity: 0,
                revenue: 0,
                name: item.name || 'Unknown Product',
                image: item.image_url || item.image || ''
              };
            }
            
            // Handle price safely
            let itemPrice = 0;
            if (typeof item.price === 'object' && item.price.$numberDecimal) {
              itemPrice = parseFloat(item.price.$numberDecimal);
            } else {
              itemPrice = parseFloat(item.price) || 0;
            }
            
            productSales[productId].quantity += item.quantity || 0;
            productSales[productId].revenue += itemPrice * (item.quantity || 0);
          });
        });

        const topProductsArray = Object.entries(productSales)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        // Update state with all the calculated data
        setStats({
          ordersTotal: orders.length,
          ordersProcessing: processingOrders.length,
          revenue: totalRevenue,
          usersTotal: users.length,
          productsTotal: products.products.length,
          productsOutOfStock: outOfStockProducts.length,
          reviewsTotal: reviews.data.length,
          reviewsPending: pendingReviews.length
        });
        
        setRecentOrders(sortedOrders.slice(0, 5));
        setTopProducts(topProductsArray);
        setRecentReviews(
          reviews.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
        );
        setSalesData(salesByDay);

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingAnimation text="Loading dashboard data..." size="large" />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-dashboard-main">
        <AdminHeaderBar onSidebarToggle={() => setSidebarOpen((v) => !v)} />
        <main className="admin-dashboard-content">
          <Container fluid className="py-4">
            <Row className="mb-4">
              <Col>
                <h1 className="h3 mb-0">Dashboard</h1>
                <p className="text-muted">Welcome to your store administration panel</p>
              </Col>
            </Row>

            {/* Stats Cards */}
            <Row className="mb-4 g-3">
              <Col lg={3} sm={6}>
                <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center gap-3">
                    <FaMoneyBillWave className="dashboard-stat-icon text-primary" size={32} />
                    <div>
                      <h6 className="text-muted mb-1">Total Revenue</h6>
                      <h3 className="mb-0">${stats.revenue.toFixed(2)}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} sm={6}>
                <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center gap-3">
                    <FaShoppingCart className="dashboard-stat-icon text-success" size={32} />
                    <div>
                      <h6 className="text-muted mb-1">Orders</h6>
                      <h3 className="mb-0">{stats.ordersTotal}</h3>
                      <small className="text-muted">{stats.ordersProcessing} processing</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} sm={6}>
                <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center gap-3">
                    <FaUsers className="dashboard-stat-icon text-info" size={32} />
                    <div>
                      <h6 className="text-muted mb-1">Customers</h6>
                      <h3 className="mb-0">{stats.usersTotal}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} sm={6}>
                <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center gap-3">
                    <FaBox className="dashboard-stat-icon text-warning" size={32} />
                    <div>
                      <h6 className="text-muted mb-1">Products</h6>
                      <h3 className="mb-0">{stats.productsTotal}</h3>
                      <small className="text-muted">{stats.productsOutOfStock} out of stock</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mb-4">
              <Col>
                <div className="dashboard-quick-actions">
                  <Link to="/admin/products" className="dashboard-action-tile">
                    <FaBox className="dashboard-action-icon text-primary" />
                    Manage Products
                  </Link>
                  <Link to="/admin/variants" className="dashboard-action-tile">
                    <FaBox className="dashboard-action-icon text-primary" />
                    Manage Variants Products
                  </Link>
                  <Link to="/admin/categories" className="dashboard-action-tile">
                    <FaTags className="dashboard-action-icon text-secondary" />
                    Manage Categories
                  </Link>
                  <Link to="/admin/orders" className="dashboard-action-tile">
                    <FaShippingFast className="dashboard-action-icon text-success" />
                    Process Orders
                  </Link>
                  <Link to="/admin/reviews" className="dashboard-action-tile">
                    <FaStar className="dashboard-action-icon text-warning" />
                    Review Management
                  </Link>
                  <Link to="/admin/users" className="dashboard-action-tile">
                    <FaUsers className="dashboard-action-icon text-info" />
                    User Management
                  </Link>
                  <Link to="/admin/products" className="dashboard-action-tile">
                    <FaExclamationTriangle className="dashboard-action-icon text-danger" />
                    Low Stock Items
                  </Link>
                </div>
              </Col>
            </Row>

            {/* Charts and Recent Orders */}
            <Row className="mb-4 g-3">
              <Col lg={8}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">Sales Overview</h5>
                      <div>
                        <Button 
                          as={Link} 
                          to="/admin/orders" 
                          variant="link" 
                          size="sm"
                          className="text-decoration-none"
                        >
                          View All
                        </Button>
                      </div>
                    </div>
                    <SalesChart data={salesData} />
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Recent Orders</h5>
                      <Button 
                        as={Link} 
                        to="/admin/orders" 
                        variant="link" 
                        size="sm"
                        className="text-decoration-none"
                      >
                        View All
                      </Button>
                    </div>
                    <RecentOrders orders={recentOrders} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Top Products and Recent Reviews */}
            <Row className="g-3">
              <Col lg={8}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">Top Selling Products</h5>
                      <Button 
                        as={Link} 
                        to="/admin/products" 
                        variant="link" 
                        size="sm"
                        className="text-decoration-none"
                      >
                        View All Products
                      </Button>
                    </div>
                    <TopProducts products={topProducts} />
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Recent Reviews</h5>
                      <Button 
                        as={Link} 
                        to="/admin/reviews" 
                        variant="link" 
                        size="sm"
                        className="text-decoration-none"
                      >
                        View All
                      </Button>
                    </div>
                    <RecentReviews reviews={recentReviews} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;