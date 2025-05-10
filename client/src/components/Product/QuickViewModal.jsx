import React from 'react';
import { Modal, Button, Row, Col, Badge, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/action';
import WishlistButton from '../wishlist/WishlistButton';
import PropTypes from 'prop-types';
import './QuickViewModal.css';

const QuickViewModal = ({ product, show, onHide }) => {
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
    if (product.stock_quantity <= 0) return;
    dispatch(addToCart({ ...product, quantity: 1 }));
    onHide(); // Close modal after adding to cart
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return '0.00';
    if (typeof price === 'object' && price.$numberDecimal) {
      return parseFloat(price.$numberDecimal).toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  };

  if (!product) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="quick-view-modal"
      onClick={e => e.stopPropagation()}
    >
      <Modal.Header>
        <Modal.Title className="quick-view-title">Quick View</Modal.Title>
        <Button variant="link" className="close-btn" onClick={onHide}>
          <FaTimes />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <div className="quick-view-img-container">
              <Image 
                src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'} 
                alt={product.name} 
                className="quick-view-img" 
                fluid 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="quick-view-details">
              <h3 className="product-name">{product.name}</h3>
              <div className="price-section mb-3">
                <span className="product-price">${formatPrice(product.price)}</span>
                {product.discount_percentage > 0 && (
                  <Badge bg="danger" className="ms-2">-{product.discount_percentage}%</Badge>
                )}
              </div>
              <p className="product-description mb-3">{product.description || 'No description available.'}</p>
              
              {product.stock_quantity > 0 ? (
                <Badge bg="success" className="stock-badge">In Stock</Badge>
              ) : (
                <Badge bg="danger" className="stock-badge">Out of Stock</Badge>
              )}

              <div className="action-buttons mt-4">
                <Button 
                  className="add-cart-btn" 
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity <= 0}
                >
                  <FaShoppingCart className="me-2" />
                  Add to Cart
                </Button>
                <div className="wishlist-button-container">
                  <WishlistButton productId={product._id} size="lg" />
                </div>
                <Button 
                  as={Link} 
                  to={`/products/${product._id}`} 
                  variant="outline-primary" 
                  className="view-details-btn"
                >
                  View Details
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

QuickViewModal.propTypes = {
  product: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
};

export default QuickViewModal;