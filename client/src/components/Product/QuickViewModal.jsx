import React, { useState, useRef, useEffect } from 'react'; // Added useState, useRef, useEffect
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
  const descriptionRef = useRef(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showViewMoreButton, setShowViewMoreButton] = useState(false);
  
  const handleAddToCart = (e) => { // Added event parameter
    if (e) e.stopPropagation(); // Prevent modal close if button is inside clickable area
    if (product.stock_quantity <= 0) return;
    dispatch(addToCart({ ...product, quantity: 1 }));
    onHide();
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return '0.00';
    if (typeof price === 'object' && price.$numberDecimal) {
      return parseFloat(price.$numberDecimal).toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  };

  useEffect(() => {
    // Reset states when product changes or modal is re-shown
    setIsDescriptionExpanded(false);
    setShowViewMoreButton(false);

    if (show && product && product.description && descriptionRef.current) {
      // Use a timeout to allow the DOM to update and calculate dimensions correctly
      const timer = setTimeout(() => {
        if (descriptionRef.current) {
          // Check if content is taller than the collapsed max-height
          // scrollHeight is the total height of the content
          // clientHeight is the visible height of the element (respects max-height)
          if (descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight) {
            setShowViewMoreButton(true);
          } else {
            setShowViewMoreButton(false);
          }
        }
      }, 50); // Small delay for rendering
      return () => clearTimeout(timer);
    }
  }, [show, product]); // Re-run when modal visibility or product changes

  if (!product) return null;

  // Helper to get the primary image URL
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find(img => img.isMain);
      return mainImage ? mainImage.url : product.images[0].url;
    }
    return product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'; // Larger placeholder
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="quick-view-modal-dialog" // Use dialogClassName for custom modal width/styles
      contentClassName="quick-view-modal-content" // Use contentClassName for modal content styling
      centered
      className="quick-view-modal" // Keep for general targeting if needed
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing if overlay is clicked
    >
      <Modal.Header closeButton={false} /* Remove default close button, using custom */ >
        <Modal.Title className="quick-view-title">Quick Look: {product.name}</Modal.Title>
        <Button variant="link" className="close-btn" onClick={(e) => {e.stopPropagation(); onHide();}} aria-label="Close">
          <FaTimes />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={5} className="quick-view-image-col">
            <div className="quick-view-img-container">
              <Image 
                src={getProductImage(product)} 
                alt={product.name} 
                className="quick-view-img" 
                fluid 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                }}
              />
            </div>
          </Col>
          <Col md={7} className="quick-view-details-col">
            <div className="quick-view-details">
              {/* <h3 className="product-name">{product.name}</h3> Removed as title is in header */}
              <div className="price-section">
                <span className="product-price">${formatPrice(product.price)}</span>
                {product.discount_percentage > 0 && (
                  <Badge pill bg="danger" className="ms-2 discount-badge-qv">-{product.discount_percentage}%</Badge>
                )}
              </div>

              <div className="stock-status-qv my-3">
                {product.stock_quantity > 0 ? (
                  <Badge pill bg="success" className="stock-badge">In Stock ({product.stock_quantity} available)</Badge>
                ) : (
                  <Badge pill bg="secondary" className="stock-badge">Out of Stock</Badge> // Changed to secondary for out of stock
                )}
              </div>

              {/* Wrapper for description and view more button */}
              <div className="description-section">
                <p 
                  ref={descriptionRef}
                  className={`product-description ${isDescriptionExpanded ? 'expanded' : ''}`}
                >
                  {product.description || 'No description available.'}
                </p>
                {showViewMoreButton && (
                  <Button 
                    variant="link" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDescriptionExpanded(!isDescriptionExpanded);
                    }} 
                    className="view-more-btn"
                  >
                    {isDescriptionExpanded ? 'View Less' : 'View More'}
                  </Button>
                )}
              </div>
              
              <div className="action-buttons">
                <Button 
                  className="add-cart-btn" 
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity <= 0}
                >
                  <FaShoppingCart className="me-2" />
                  Add to Cart
                </Button>
                <div className="wishlist-button-container">
                  {/* Ensure WishlistButton receives appropriate props for styling if needed */}
                  <WishlistButton productId={product._id} size="lg" classNameCustom="quick-view-wishlist-btn" />
                </div>
                
              </div>
              <Button 
                  as={Link} 
                  to={`/products/${product._id}`} 
                  variant="outline-primary" 
                  className="view-details-btn mt-3 w-100" // Make it full width and add margin
                  onClick={(e) => {e.stopPropagation(); /* onHide(); Optional: close modal on nav */}}
                >
                  View Full Product Details
                </Button>
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