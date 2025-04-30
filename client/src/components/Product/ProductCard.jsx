import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/action';
import { FaShoppingCart } from 'react-icons/fa';
import Button from '../UI/Button';
import './ProductCard.css';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (product.stock_quantity <= 0) return;
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <Card className="product-card h-100">
      <div className="product-image-container">
        <Link to={`/products/${product._id}`}>
          <Card.Img 
            variant="top" 
            src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'} 
            className="product-image"
            alt={product.name}
          />
        </Link>
        {product.stock_quantity <= 0 && (
          <Badge bg="danger" className="out-of-stock-badge">Out of Stock</Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Link to={`/products/${product._id}`} className="product-title-link">
          <Card.Title className="product-title">{product.name}</Card.Title>
        </Link>
        <Card.Text className="text-muted mb-0 product-category">
          {product.category?.name || 'Uncategorized'}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="product-price">
              ${(product.price || 0).toFixed(2)}
            </span>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
              icon={FaShoppingCart}
            >
              Add
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductCard;