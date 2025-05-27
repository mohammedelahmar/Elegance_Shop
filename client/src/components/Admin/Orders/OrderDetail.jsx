import React from 'react';
import { Modal, Card, Row, Col, Badge, Table, Button, ListGroup } from 'react-bootstrap';
import { FaCreditCard, FaTruck } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './OrderDetail.css'; // Import the new CSS file

// Add this helper function at the top of your component
const formatPrice = (value) => {
  // Check if value is a number or can be converted to a number
  if (value === null || value === undefined) return '0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

const OrderDetail = ({ order, show, onHide, onMarkDelivered, onMarkPaid, isLoading }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      dialogClassName="order-detail-modal" // Add this class to target the modal
    >
      <Modal.Header closeButton>
        <Modal.Title>Order #{order._id.substring(order._id.length - 8)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>Customer Information</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Name:</strong> {order.user_id?.Firstname || ''} {order.user_id?.Lastname || 'Guest'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email:</strong> {order.user_id?.email || 'N/A'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Order Date:</strong> {formatDate(order.createdAt)}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>Shipping Information</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Address:</strong> {order.shippingAddress?.address || 'N/A'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>City:</strong> {order.shippingAddress?.city || ''}, {order.shippingAddress?.postal_code || ''}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Country:</strong> {order.shippingAddress?.country || ''}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Header>Payment Status</Card.Header>
              <Card.Body className="d-flex flex-column align-items-start"> {/* Ensure content flows well */}
                <div className="d-flex align-items-center mb-2">
                  <strong className="me-2">Method:</strong> {order.paymentMethod || 'Not specified'}
                </div>
                <div className="d-flex align-items-center">
                  <strong className="me-2">Status:</strong>
                  {order.isPaid ? (
                    <Badge bg="success" className="status-badge">
                      Paid on {formatDate(order.paidAt)}
                    </Badge>
                  ) : (
                    <Badge bg="warning" text="dark" className="status-badge">
                      Not Paid
                    </Badge>
                  )}
                </div>
                {!order.isPaid && (
                  <Button
                    variant="success" // Will be styled by OrderDetail.css
                    className="mt-3 align-self-start" // Align button to start
                    onClick={() => onMarkPaid(order._id)}
                    disabled={isLoading}
                    size="sm"
                  >
                    <FaCreditCard className="me-1" /> Mark as Paid
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>Delivery Status</Card.Header>
              <Card.Body className="d-flex flex-column align-items-start"> {/* Ensure content flows well */}
                <div className="d-flex align-items-center">
                  <strong className="me-2">Status:</strong>
                  {order.isDelivered ? (
                    <Badge bg="success" className="status-badge">
                      Delivered on {formatDate(order.deliveredAt)}
                    </Badge>
                  ) : (
                    <Badge bg="warning" text="dark" className="status-badge">
                      Not Delivered
                    </Badge>
                  )}
                </div>
                {order.isPaid && !order.isDelivered && (
                  <Button
                    variant="info" // Will be styled by OrderDetail.css
                    className="mt-3 align-self-start" // Align button to start
                    onClick={() => onMarkDelivered(order._id)}
                    disabled={isLoading}
                    size="sm"
                  >
                    <FaTruck className="me-1" /> Mark as Delivered
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Header>Order Items</Card.Header>
          {/* Removed table-responsive from here, modal itself is scrollable if needed */}
          <Table hover className="align-middle"> {/* Added hover and align-middle for consistency */}
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems && order.orderItems.map((item, index) => (
                <tr key={item._id || index}> {/* Use item._id if available for a more stable key */}
                  <td>{item.product?.name || item.name || 'Unknown Product'}</td>
                  <td>${formatPrice(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>${formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <Card.Header>Order Summary</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Items Price:</span>
              <span>${formatPrice(order.itemsPrice)}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Shipping Price:</span>
              <span>${formatPrice(order.shippingPrice)}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Tax Price:</span>
              <span>${formatPrice(order.taxPrice)}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between fw-bold">
              <span>Total Price:</span>
              <span>${formatPrice(order.totalPrice || order.total_amount)}</span>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}> {/* Will be styled by OrderDetail.css */}
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

OrderDetail.propTypes = {
  order: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onMarkDelivered: PropTypes.func.isRequired,
  onMarkPaid: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default OrderDetail;