import React, { useState, useRef } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/action';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import Button from '../UI/Button';
import WishlistButton from '../wishlist/WishlistButton';
import QuickViewModal from './QuickViewModal';
import './ProductCard.css';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewTimer, setIsQuickViewTimer] = useState(null);
  const cardRef = useRef(null);

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

  // Add this function to get the main image URL
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find(img => img.isMain);
      return mainImage ? mainImage.url : product.images[0].url;
    }
    return product.image_url || 'https://via.placeholder.com/300x300?text=No+Image';
  };

  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (product.stock_quantity <= 0) return;
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  };
  
  // Handle showing quick view
  const handleQuickViewShow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };
  
  // Handle mouse enter with delay for QuickView
  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Add a delay before showing QuickView to prevent accidental triggers
    const timer = setTimeout(() => {
      if (cardRef.current && cardRef.current.matches(':hover')) {
        setShowQuickView(true);
      }
    }, 800); // 800ms delay
    
    setIsQuickViewTimer(timer);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // Clear the timeout if mouse leaves before the delay
    if (isQuickViewTimer) {
      clearTimeout(isQuickViewTimer);
      setIsQuickViewTimer(null);
    }
  };
  
  // Track recently viewed product
  const handleProductClick = () => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const exists = recentlyViewed.some(item => item._id === product._id);
    
    if (!exists) {
      // Add to the front of the array
      recentlyViewed.unshift({
        _id: product._id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        timestamp: new Date().getTime()
      });
      
      // Keep only 10 most recent items
      const updatedRecent = recentlyViewed.slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
    }
  };

  return (
    <>
      <Card 
        className={`product-card h-100 ${isHovered ? 'hovered' : ''}`} 
        style={{ backgroundColor: '#1e2634' }}
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="product-image-container">
          <Link to={`/products/${product._id}`} onClick={handleProductClick}>
            <Card.Img
              variant="top"
              src={getProductImage(product)}
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

          {/* Quick View Overlay */}
          <div className="product-overlay">
            <div className="product-actions">
              <Button 
                variant="light"
                size="sm"
                className="action-btn add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                icon={FaShoppingCart}
              />
              <div className="action-btn wishlist-btn">
                <WishlistButton productId={product._id} size="sm" className="w-100 h-100" />
              </div>
              <Button 
                variant="light"
                size="sm"
                className="action-btn quick-view-btn"
                onClick={handleQuickViewShow}
                icon={FaEye}
              />
            </div>
          </div>
        </div>

        <Card.Body className="d-flex flex-column">
          <div className="flex-grow-1">
            <Card.Title className="product-title">
              <Link to={`/products/${product._id}`} onClick={handleProductClick}>
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
      
      <QuickViewModal 
        product={product}
        show={showQuickView}
        onHide={() => setShowQuickView(false)}
      />
    </>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductCard;