import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated, currentUser, isAdmin } = useAuth();

  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h1>Welcome to Our Store</h1>
          <p className="lead">
            Find the best products at competitive prices
          </p>
          
          {isAuthenticated ? (
            <div className="mt-4">
              <h4>Welcome back, {currentUser?.Firstname}!</h4>
              <div className="d-flex justify-content-center gap-3 mt-3">
                <Button as={Link} to="/profile" variant="outline-primary">
                  View Profile
                </Button>
                {isAdmin && (
                  <Button as={Link} to="/admin/dashboard" variant="outline-success">
                    Admin Dashboard
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 d-flex justify-content-center gap-3">
              <Button as={Link} to="/login" variant="primary">
                Login
              </Button>
              <Button as={Link} to="/register" variant="outline-primary">
                Register
              </Button>
            </div>
          )}
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col>
          <h2 className="text-center mb-4">Featured Products</h2>
        </Col>
      </Row>
      
      <Row>
        {/* You would map through featured products here */}
        {[1, 2, 3, 4].map((item) => (
          <Col key={item} md={3} className="mb-4">
            <Card>
              <Card.Img variant="top" src={`https://via.placeholder.com/300x200?text=Product+${item}`} />
              <Card.Body>
                <Card.Title>Product {item}</Card.Title>
                <Card.Text>
                  Product description goes here
                </Card.Text>
                <Button variant="primary">View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;