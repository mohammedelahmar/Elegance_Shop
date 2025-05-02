import React from 'react';
import { Modal, Card, Row, Col, Badge, Table, Button, ListGroup } from 'react-bootstrap';
import { FaCreditCard, FaTruck } from 'react-icons/fa';
import PropTypes from 'prop-types';

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
                  <strong>Name:</strong> {order.user?.name || 'Guest'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email:</strong> {order.user?.email || 'N/A'}
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
                  <strong>Address:</strong> {order.shippingAddress?.address}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>City:</strong> {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Country:</strong> {order.shippingAddress?.country}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Header>Payment Status</Card.Header>
              <Card.Body>
                <p>
                  <strong>Method:</strong> {order.paymentMethod || 'Not specified'}
                </p>
                <div className="d-flex align-items-center">
                  <strong className="me-2">Status:</strong>
                  {order.isPaid ? (
                    <Badge bg="success">
                      Paid on {formatDate(order.paidAt)}
                    </Badge>
                  ) : (
                    <Badge bg="warning" text="dark">
                      Not Paid
                    </Badge>
                  )}
                </div>
                {!order.isPaid && (
                  <Button
                    variant="success"
                    className="mt-3"
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
              <Card.Body>
                <div className="d-flex align-items-center">
                  <strong className="me-2">Status:</strong>
                  {order.isDelivered ? (
                    <Badge bg="success">
                      Delivered on {formatDate(order.deliveredAt)}
                    </Badge>
                  ) : (
                    <Badge bg="warning" text="dark">
                      Not Delivered
                    </Badge>
                  )}
                </div>
                {order.isPaid && !order.isDelivered && (
                  <Button
                    variant="info"
                    className="mt-3"
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
          <Table responsive>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center">
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="me-2"
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>${item.price?.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <Card.Header>Order Summary</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Items:</span>
              <span>${order.itemsPrice?.toFixed(2) || '0.00'}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Shipping:</span>
              <span>${order.shippingPrice?.toFixed(2) || '0.00'}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Tax:</span>
              <span>${order.taxPrice?.toFixed(2) || '0.00'}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span>${order.totalPrice?.toFixed(2) || '0.00'}</span>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
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