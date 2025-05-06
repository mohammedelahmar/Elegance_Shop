import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import WishlistList from '../components/wishlist/WishlistList';
import { FaHeart, FaArrowLeft, FaTrash } from 'react-icons/fa';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlistItems, loading, error, fetchWishlist, clearWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated) {
      navigate('/login?redirect=wishlist');
      return;
    }
    
    // Only fetch once when the component mounts or authentication changes
    fetchWishlist();
    // Remove fetchWishlist from the dependency array to prevent the loop
  }, [isAuthenticated, navigate]); // fetchWishlist removed from dependency array

  return (
    <Container className="py-5 wishlist-page">
      <Row className="mb-4">
        <Col>
          <h1>
            <FaHeart className="text-danger me-2" /> 
            My Wishlist
          </h1>
          <p className="text-muted">
            Items you've saved to purchase later.
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Saved Items ({wishlistItems?.length || 0})
              </h5>
              {wishlistItems?.length > 0 && (
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your wishlist?')) {
                      clearWishlist();
                    }
                  }}
                >
                  <FaTrash className="me-2" />
                  Clear All
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <WishlistList 
                products={wishlistItems}
                loading={loading}
                error={error}
              />
            </Card.Body>
          </Card>

          <div className="mt-4">
            <Button as={Link} to="/products" variant="outline-primary">
              <FaArrowLeft className="me-2" /> Continue Shopping
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default WishlistPage;