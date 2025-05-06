import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/action';
import { FaShoppingCart } from 'react-icons/fa';
import Button from '../UI/Button';
import WishlistButton from '../wishlist/WishlistButton';
import './ProductCard.css';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (product.stock_quantity <= 0) return;
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  // Helper function to safely format price
  const formatPrice = (price) => {
    if (!price) return '0.00';
    
    // Handle Decimal128 format from MongoDB
    if (typeof price === 'object' && price.$numberDecimal) {
      return parseFloat(price.$numberDecimal).toFixed(2);
    }
    
    // Handle regular number or string
    return parseFloat(price).toFixed(2);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  };

  return (
    <Card className="product-card h-100" style={{ backgroundColor: '#1e2634' }}>
      <div className="product-image-container">
        <Link to={`/products/${product._id}`}>
          <Card.Img
            variant="top"
            src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="product-image"
            onError={handleImageError}
          />
        </Link>
        {product.discount_percentage > 0 && (
          <div className="discount-badge">-{product.discount_percentage}%</div>
        )}
        {product.stock_quantity <= 0 && (
          <Badge className="out-of-stock-badge">Out of Stock</Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="flex-grow-1">
          <Card.Title className="product-title">
            <Link to={`/products/${product._id}`}>
              {product.name}
            </Link>
          </Card.Title>
          <Card.Text className="product-price">
            ${formatPrice(product.price)}
          </Card.Text>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex">
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
              icon={FaShoppingCart}
            >
              Add
            </Button>
            <div className="ms-2">
              <WishlistButton productId={product._id} size="sm" />
            </div>
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