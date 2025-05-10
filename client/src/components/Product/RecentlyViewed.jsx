import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaTrash } from 'react-icons/fa';
import useRecentlyViewed from '../../hooks/useRecentlyViewed';
import './RecentlyViewed.css';

// Add this helper function at the top of your component file
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

const RecentlyViewed = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  
  if (!recentlyViewed.length) return null;
  
  return (
    <div className="recently-viewed-section">
      <div className="recently-viewed-header">
        <h3 className="section-title">
          <FaEye className="me-2" /> Recently Viewed
        </h3>
        <button 
          className="clear-history-btn" 
          onClick={clearRecentlyViewed}
          aria-label="Clear recently viewed products"
        >
          <FaTrash /> Clear history
        </button>
      </div>
      
      <Row className="g-4 recently-viewed-row">
        {recentlyViewed.map(product => (
          <Col xs={6} md={3} lg={3} key={product._id}>
            <Link to={`/products/${product._id}`} className="recently-viewed-item">
              <Card className="recently-viewed-card">
                <div className="recently-viewed-img-container">
                  <Card.Img 
                    variant="top" 
                    src={product.image_url} 
                    alt={product.name}
                    className="recently-viewed-img" 
                  />
                </div>
                <Card.Body className="recently-viewed-body">
                  <Card.Title className="recently-viewed-title">{product.name}</Card.Title>
                  <Card.Text className="recently-viewed-price">${formatPrice(product.price)}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RecentlyViewed;  