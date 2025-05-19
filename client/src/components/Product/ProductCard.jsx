import React, { useState, useRef, useEffect } from 'react';
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
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // For future parallax
  const cardRef = useRef(null);
  const [isQuickViewTimer, setIsQuickViewTimer] = useState(null);

  const formatPrice = (price) => {
    if (!price) return '0.00';
    if (typeof price === 'object' && price.$numberDecimal) {
      return parseFloat(price.$numberDecimal).toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  };

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
  
  const handleQuickViewShow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };
  
  const handleMouseEnter = () => {
    if (isQuickViewTimer) clearTimeout(isQuickViewTimer);
    const timer = setTimeout(() => {
      if (cardRef.current && cardRef.current.matches(':hover')) {
        setShowQuickView(true);
      }
    }, 600);
    setIsQuickViewTimer(timer);
  };
  
  const handleMouseLeave = () => {
    if (isQuickViewTimer) {
      clearTimeout(isQuickViewTimer);
      setIsQuickViewTimer(null);
    }
  };

  // const handleMouseMove = (e) => { // For future parallax
  //   if (!cardRef.current) return;
  //   const rect = cardRef.current.getBoundingClientRect();
  //   const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  //   const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  //   setMousePosition({ x, y });
  // };

  useEffect(() => {
    return () => {
      if (isQuickViewTimer) {
        clearTimeout(isQuickViewTimer);
      }
    };
  }, [isQuickViewTimer]);
  
  const handleProductClick = () => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const exists = recentlyViewed.some(item => item._id === product._id);
    if (!exists) {
      recentlyViewed.unshift({
        _id: product._id,
        name: product.name,
        price: product.price,
        image_url: getProductImage(product), // Use getProductImage for consistency
        timestamp: new Date().getTime()
      });
      const updatedRecent = recentlyViewed.slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
    }
  };

  return (
    <>
      <Card 
        className={`product-card h-100`}
        style={{ backgroundColor: 'var(--dark-card-bg)'}}
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // onMouseMove={handleMouseMove} // For future parallax
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
            <Badge bg="danger" className="out-of-stock-badge">Out of Stock</Badge>
          )}

          <div className="product-overlay">
            <div className="product-actions">
              <Button 
                variant="light"
                size="sm"
                className="action-btn add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                icon={FaShoppingCart}
                aria-label="Add to cart"
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
                aria-label="Quick view"
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
          {/* Commented out buttons are still here */}
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
  product: PropTypes.object.isRequired,
};

export default ProductCard;