import React, { useMemo } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaShoppingCart, FaMoneyBillWave, FaBoxOpen, FaTruck } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './OrderStats.css'; // Import the new OrderStats.css

const OrderStats = ({ orders, className }) => {
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    
    const totalRevenue = orders
      .filter(order => order.isPaid)
      .reduce((sum, order) => {
        let price = 0;
        if (order.totalPrice) {
          if (typeof order.totalPrice === 'object' && order.totalPrice.$numberDecimal) {
            price = parseFloat(order.totalPrice.$numberDecimal);
          } else {
            price = parseFloat(order.totalPrice);
          }
        } else if (order.total_amount) {
          if (typeof order.total_amount === 'object' && order.total_amount.$numberDecimal) {
            price = parseFloat(order.total_amount.$numberDecimal);
          } else {
            price = parseFloat(order.total_amount);
          }
        }
        return sum + (isNaN(price) ? 0 : price); // Ensure NaN is handled
      }, 0);
    
    const deliveredOrders = orders.filter(order => order.isDelivered).length;
    const pendingOrders = orders.filter(order => !order.isDelivered).length;
    return {
      totalOrders,
      totalRevenue,
      deliveredOrders,
      pendingOrders
    };
  }, [orders]);

  return (
    <Row className={`${className || ''} order-stats-container mb-4 g-3`}>
      <Col lg={3} sm={6}>
        <Card className="dashboard-stat-card h-100"> {/* Removed border-0 shadow-sm */}
          <Card.Body>
            <div className="dashboard-stat-icon text-success">
              <FaShoppingCart />
            </div>
            <div>
              <h6 className="text-muted mb-1">Total Orders</h6>
              <h3 className="mb-0">{stats.totalOrders}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} sm={6}>
        <Card className="dashboard-stat-card h-100"> {/* Removed border-0 shadow-sm */}
          <Card.Body>
            <div className="dashboard-stat-icon text-primary">
              <FaMoneyBillWave />
            </div>
            <div>
              <h6 className="text-muted mb-1">Total Revenue</h6>
              <h3 className="mb-0">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} sm={6}>
        <Card className="dashboard-stat-card h-100"> {/* Removed border-0 shadow-sm */}
          <Card.Body>
            <div className="dashboard-stat-icon text-warning">
              <FaBoxOpen />
            </div>
            <div>
              <h6 className="text-muted mb-1">Pending Delivery</h6>
              <h3 className="mb-0">{stats.pendingOrders}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} sm={6}>
        <Card className="dashboard-stat-card h-100"> {/* Removed border-0 shadow-sm */}
          <Card.Body>
            <div className="dashboard-stat-icon text-info">
              <FaTruck />
            </div>
            <div>
              <h6 className="text-muted mb-1">Delivered</h6>
              <h3 className="mb-0">{stats.deliveredOrders}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

OrderStats.propTypes = {
  orders: PropTypes.array.isRequired,
  className: PropTypes.string
};

export default OrderStats;