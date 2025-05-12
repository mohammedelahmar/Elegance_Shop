import React from 'react';
import { Card, Row, Col, ListGroup, Image, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { FaTruck } from 'react-icons/fa';

// Add this helper function at the top
const formatPrice = (price) => {
  if (!price) return '0.00';
  
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

const OrderDetail = ({ order, isAdmin, onMarkDelivered, deliverLoading }) => {
  if (!order) return null;
  
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Row>
          <Col md={6} className="mb-4 mb-md-0">
            <h2 className="h4 mb-3">Shipping</h2>
            <p className="mb-1">
              <strong>Name:</strong> {order.user?.name || 'N/A'}
            </p>
            <p className="mb-1">
              <strong>Email:</strong>{' '}
              {order.user?.email ? (
                <a href={`mailto:${order.user.email}`} className="text-primary">
                  {order.user.email}
                </a>
              ) : (
                'N/A'
              )}
            </p>
            {order.shippingAddress ? (
              <p className="mb-3">
                <strong>Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
            ) : (
              <p className="mb-3">
                <strong>Address:</strong> Shipping information unavailable
              </p>
            )}
            <Card className="bg-light mb-4">
              <Card.Body className="py-2">
                {order.isDelivered ? (
                  <p className="text-success mb-0">
                    Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-danger mb-0">Not Delivered</p>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <h2 className="h4 mb-3">Payment Method</h2>
            <p className="mb-3">
              <strong>Method:</strong> {order.paymentMethod || 'Not specified'}
            </p>
            <Card className="bg-light">
              <Card.Body className="py-2">
                {order.isPaid ? (
                  <p className="text-success mb-0">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-danger mb-0">Not Paid</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h2 className="h4 mt-4 mb-3">Order Items</h2>
        {!order.orderItems || order.orderItems.length === 0 ? (
          <p>Order is empty</p>
        ) : (
          <ListGroup variant="flush">
            {order.orderItems.map((item, index) => (
              <ListGroup.Item key={index}>
                <Row className="align-items-center">
                  <Col xs={2} md={1}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fluid
                      rounded
                    />
                  </Col>
                  <Col xs={10} md={8} className="d-flex align-items-center">
                    <Link to={`/product/${item.product}`} className="text-decoration-none">
                      {item.name || 'Product'}
                    </Link>
                  </Col>
                  <Col md={3} className="text-md-end mt-2 mt-md-0">
                    {(item.quantity || 1)} x ${formatPrice(item.price)} = ${formatPrice((item.quantity || 1) * (item.price || 0))}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <Card className="mt-4 bg-light">
          <Card.Body>
            <h2 className="h4 mb-3">Order Summary</h2>
            <Row className="mb-2">
              <Col>Items:</Col>
              <Col className="text-end">${formatPrice(order.itemsPrice)}</Col>
            </Row>
            <Row className="mb-2">
              <Col>Shipping:</Col>
              <Col className="text-end">${formatPrice(order.shippingPrice)}</Col>
            </Row>
            <Row className="mb-2">
              <Col>Tax:</Col>
              <Col className="text-end">${formatPrice(order.taxPrice)}</Col>
            </Row>
            <Row className="fw-bold mb-3">
              <Col>Total:</Col>
              <Col className="text-end">${formatPrice(order.totalPrice || order.total_amount)}</Col>
            </Row>
            
            {isAdmin && order.isPaid && !order.isDelivered && (
              <Button
                variant="success"
                onClick={onMarkDelivered}
                isLoading={deliverLoading}
                fullWidth
                icon={FaTruck}
              >
                Mark As Delivered
              </Button>
            )}
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default OrderDetail;