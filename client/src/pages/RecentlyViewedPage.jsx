import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import RecentlyViewed from '../components/Product/RecentlyViewed';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import { FaEye, FaArrowLeft } from 'react-icons/fa';

const RecentlyViewedPage = () => {
  const { recentlyViewed } = useRecentlyViewed();
  
  return (
    <Container className="py-5">
      <Helmet>
        <title>Recently Viewed Products</title>
      </Helmet>
      
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="page-title">
              <FaEye className="me-2" /> Recently Viewed Products
            </h1>
            <Link to="/" className="btn btn-outline-primary">
              <FaArrowLeft className="me-2" /> Continue Shopping
            </Link>
          </div>
          
          {recentlyViewed.length === 0 ? (
            <Card className="text-center p-5 bg-light">
              <Card.Body>
                <h3 className="mb-3">No Recently Viewed Products</h3>
                <p className="text-muted mb-4">
                  Explore our products and they will appear here for easy access later.
                </p>
                <Link to="/products" className="btn btn-primary">
                  Browse Products
                </Link>
              </Card.Body>
            </Card>
          ) : (
            <RecentlyViewed />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RecentlyViewedPage;