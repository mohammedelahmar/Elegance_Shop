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
import Loader from '../../components/UI/Loader';
import Message from '../../components/UI/Message';
import RecentOrders from '../../components/Admin/Dashboard/RecentOrders';
import SalesChart from '../../components/Admin/Dashboard/SalesChart';
import TopProducts from '../../components/Admin/Dashboard/TopProducts';
import RecentReviews from '../../components/Admin/Dashboard/RecentReviews';

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
        const totalRevenue = orders.reduce((sum, order) => 
          sum + (order.isPaid ? order.totalPrice : 0), 0);
        
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
          
          order.orderItems.forEach(item => {
            if (!productSales[item.product_id]) {
              productSales[item.product_id] = {
                quantity: 0,
                revenue: 0,
                name: item.name,
                image: item.image_url
              };
            }
            productSales[item.product_id].quantity += item.quantity;
            productSales[item.product_id].revenue += item.price * item.quantity;
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

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
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
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-15 p-3 me-3">
                <FaMoneyBillWave className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Revenue</h6>
                <h3 className="mb-0">${stats.revenue.toFixed(2)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} sm={6}>
          <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-15 p-3 me-3">
                <FaShoppingCart className="text-success" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Orders</h6>
                <h3 className="mb-0">{stats.ordersTotal}</h3>
                <small className="text-muted">
                  {stats.ordersProcessing} processing
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} sm={6}>
          <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-info bg-opacity-15 p-3 me-3">
                <FaUsers className="text-info" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Customers</h6>
                <h3 className="mb-0">{stats.usersTotal}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} sm={6}>
          <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-warning bg-opacity-15 p-3 me-3">
                <FaBox className="text-warning" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Products</h6>
                <h3 className="mb-0">{stats.productsTotal}</h3>
                <small className="text-muted">
                  {stats.productsOutOfStock} out of stock
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Quick Actions</h5>
              <div className="d-flex flex-wrap gap-2">
                <Button 
                  as={Link} 
                  to="/admin/products" 
                  variant="outline-primary"
                  className="d-flex align-items-center"
                >
                  <FaBox className="me-2" /> Manage Products
                </Button>
                <Button 
                  as={Link} 
                  to="/admin/categories" 
                  variant="outline-secondary"
                  className="d-flex align-items-center"
                >
                  <FaTags className="me-2" /> Manage Categories
                </Button>
                <Button 
                  as={Link} 
                  to="/admin/orders" 
                  variant="outline-success"
                  className="d-flex align-items-center"
                >
                  <FaShippingFast className="me-2" /> Process Orders
                </Button>
                <Button 
                  as={Link} 
                  to="/admin/reviews" 
                  variant="outline-warning"
                  className="d-flex align-items-center"
                >
                  <FaStar className="me-2" /> Review Management
                </Button>
                <Button 
                  as={Link} 
                  to="/admin/users" 
                  variant="outline-info"
                  className="d-flex align-items-center"
                >
                  <FaUsers className="me-2" /> User Management
                </Button>
                <Button 
                  as={Link} 
                  to="/admin/products" 
                  variant="outline-danger"
                  className="d-flex align-items-center"
                >
                  <FaExclamationTriangle className="me-2" /> Low Stock Items
                </Button>
              </div>
            </Card.Body>
          </Card>
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
  );
};

export default Dashboard;