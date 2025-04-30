import React, { useState } from 'react';
import { Row, Col, Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import './WishlistItem.css';

const WishlistItem = ({ product }) => {
  const [removing, setRemoving] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
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
    setAddingToCart(true);
    try {
      await addItem(product._id, 1);
      // Could show a success message here
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Card className="wishlist-item mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={3} md={2}>
            <Link to={`/products/${product._id}`}>
              <Image 
                src={product.image_url || 'https://via.placeholder.com/100x100?text=No+Image'} 
                alt={product.name} 
                fluid 
                className="wishlist-item-image" 
              />
            </Link>
          </Col>
          
          <Col xs={9} md={5}>
            <Link to={`/products/${product._id}`} className="text-decoration-none">
              <h5 className="mb-1">{product.name}</h5>
            </Link>
            <p className="text-muted mb-0 small">
              {product.category?.name || 'Uncategorized'}
            </p>
            {product.stock_quantity <= 0 && (
              <span className="text-danger small">Out of stock</span>
            )}
          </Col>
          
          <Col xs={6} md={2} className="mt-3 mt-md-0 text-md-end">
            <h5 className="mb-0 text-primary">${product.price?.toFixed(2) || '0.00'}</h5>
          </Col>
          
          <Col xs={6} md={3} className="mt-3 mt-md-0 d-flex justify-content-end">
            <Button 
              variant="outline-primary" 
              className="me-2"
              disabled={product.stock_quantity <= 0}
              onClick={handleAddToCart}
              isLoading={addingToCart}
              title="Add to cart"
              icon={FaShoppingCart}
            >
              <span className="d-none d-md-inline">Add to Cart</span>
            </Button>
            
            <Button 
              variant="outline-danger" 
              onClick={handleRemove}
              isLoading={removing}
              title="Remove from wishlist"
              icon={FaTrash}
            >
              <span className="d-none d-md-inline">Remove</span>
            </Button>
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