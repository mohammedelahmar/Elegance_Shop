import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import WishlistList from '../components/wishlist/WishlistList';
import { FaHeart, FaArrowLeft, FaTrash, FaShoppingCart } from 'react-icons/fa';
import LoadingAnimation from '../components/common/LoadingAnimation';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlistItems, loading, error, fetchWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [clearingAll, setClearingAll] = useState(false);
  const [movingToCart, setMovingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch wishlist on component mount or auth changes
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=wishlist');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, navigate]);

  // Handle clear all wishlist items
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      setClearingAll(true);
      try {
        await clearWishlist();
        setSuccessMessage('Wishlist cleared successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Failed to clear wishlist:', err);
      } finally {
        setClearingAll(false);
      }
    }
  };

  // Handle moving all items to cart
  const handleMoveAllToCart = async () => {
    setMovingToCart(true);
    try {
      // Filter out out-of-stock items
      const inStockItems = wishlistItems.filter(item => item.stock_quantity > 0);
      
      if (inStockItems.length === 0) {
        alert('No in-stock items to add to cart');
        setMovingToCart(false);
        return;
      }

      // Add each item to cart
      for (const item of inStockItems) {
        await addItem(item._id, 1);
      }
      
      setSuccessMessage(`Added ${inStockItems.length} items to your cart`);
      setTimeout(() => {
        setSuccessMessage('');
        if (window.confirm('Items added to cart. View your cart now?')) {
          navigate('/cart');
        }
      }, 2000);
    } catch (err) {
      console.error('Failed to move items to cart:', err);
    } finally {
      setMovingToCart(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="wishlist-page p-4">
              <div className="wishlist-header">
                <h1>
                  <FaHeart className="text-danger me-2" /> 
                  My Wishlist
                </h1>
                <p className="text-muted">
                  Items you've saved to purchase later
                </p>
              </div>

              {successMessage && (
                <Alert variant="info" className="mb-4" style={{ background: 'rgba(74, 107, 245, 0.2)', borderColor: 'rgba(74, 107, 245, 0.3)', color: '#4a9fff' }}>
                  <div className="d-flex align-items-center">
                    <div className="me-2">✓</div> {successMessage}
                  </div>
                </Alert>
              )}

              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 d-flex align-items-center">
                    Saved Items
                    <span className="ms-2 bg-primary bg-opacity-25 px-2 py-1 rounded-circle">
                      {wishlistItems?.length || 0}
                    </span>
                  </h5>
                  
                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={handleMoveAllToCart}
                      disabled={movingToCart || wishlistItems.length === 0}
                      className="d-flex align-items-center"
                    >
                      <span className="d-inline">Move All to Cart</span>
                    </Button>
                    
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={handleClearAll}
                      disabled={clearingAll || wishlistItems.length === 0}
                      className="d-flex align-items-center"
                    >
                      <span className="d-inline">Clear All</span>
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center py-4">
                      <LoadingAnimation text="Loading your wishlist items..." />
                    </div>
                  ) : (
                    <WishlistList 
                      products={wishlistItems}
                      loading={loading}
                      error={error}
                    />
                  )}
                </Card.Body>
              </Card>

              <div className="mt-4">
                <Button 
                  as={Link} 
                  to="/products" 
                  className="continue-shopping-btn"
                >
                  <FaArrowLeft className="me-2" /> Continue Shopping
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default WishlistPage;