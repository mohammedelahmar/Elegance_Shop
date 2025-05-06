import React, { useState } from 'react';
import { Row, Col, Card, Badge, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import './WishlistItem.css';

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

const WishlistItem = ({ product }) => {
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);
  const { removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeItem(product._id);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem(product._id, 1);
      // Optionally remove from wishlist after adding to cart
      // await removeItem(product._id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="wishlist-item">
      <Card.Body>
        <Row className="align-items-center">
          {/* Product image column */}
          <Col xs={3} md={2}>
            <Link to={`/products/${product._id}`}>
              <div className="wishlist-item-image-container">
                <Image 
                  src={product.image_url} 
                  alt={product.name} 
                  className="wishlist-item-image" 
                />
              </div>
            </Link>
          </Col>
          
          {/* Product info column */}
          <Col xs={6} md={6}>
            <Link to={`/products/${product._id}`} className="text-decoration-none">
              <h5 className="wishlist-item-title">{product.name}</h5>
            </Link>
            <span className="wishlist-item-category">
              {product.category?.name || 'Uncategorized'}
            </span>
          </Col>
          
          {/* Price and actions column */}
          <Col xs={3} md={4}>
            <div className="d-flex justify-content-end align-items-center flex-wrap">
              <div className="wishlist-item-price-container me-3">
                <span className="wishlist-item-price">${formatPrice(product.price)}</span>
              </div>
              
              <div className="wishlist-item-actions">
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleAddToCart}
                  disabled={adding || product.stock_quantity <= 0}
                  isLoading={adding}
                  className="add-to-cart-btn me-2"
                >
                  <FaShoppingCart className="me-1" />
                  <span className="d-none d-md-inline">Add</span>
                </Button>
                
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleRemove}
                  disabled={removing}
                  isLoading={removing}
                  className="remove-btn"
                >
                  <FaTrash className="me-1" />
                  <span className="d-none d-md-inline">Remove</span>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

WishlistItem.propTypes = {
  product: PropTypes.object.isRequired
};

export default WishlistItem;