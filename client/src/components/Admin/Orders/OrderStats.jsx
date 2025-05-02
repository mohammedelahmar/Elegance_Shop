import React, { useMemo } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaShoppingCart, FaMoneyBillWave, FaBoxOpen, FaTruck } from 'react-icons/fa';
import PropTypes from 'prop-types';

const OrderStats = ({ orders, className }) => {
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const paidOrders = orders.filter(order => order.isPaid).length;
    const deliveredOrders = orders.filter(order => order.isDelivered).length;
    const pendingOrders = orders.filter(order => !order.isDelivered).length;

    return {
      totalOrders,
      totalRevenue,
      paidOrders,
      deliveredOrders,
      pendingOrders
    };
  }, [orders]);

  return (
    <Row className={className}>
      <Col md={3} sm={6} className="mb-4 mb-md-0">
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
              <FaShoppingCart className="text-primary" size={24} />
            </div>
            <div>
              <h6 className="fw-normal text-muted mb-0">Total Orders</h6>
              <h3 className="fw-bold mb-0">{stats.totalOrders}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6} className="mb-4 mb-md-0">
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
              <FaMoneyBillWave className="text-success" size={24} />
            </div>
            <div>
              <h6 className="fw-normal text-muted mb-0">Total Revenue</h6>
              <h3 className="fw-bold mb-0">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6} className="mb-4 mb-md-0">
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
              <FaBoxOpen className="text-warning" size={24} />
            </div>
            <div>
              <h6 className="fw-normal text-muted mb-0">Pending Delivery</h6>
              <h3 className="fw-bold mb-0">{stats.pendingOrders}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6} className="mb-4 mb-md-0">
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
              <FaTruck className="text-info" size={24} />
            </div>
            <div>
              <h6 className="fw-normal text-muted mb-0">Delivered</h6>
              <h3 className="fw-bold mb-0">{stats.deliveredOrders}</h3>
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