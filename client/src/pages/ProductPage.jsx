import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, Row, Col, Button, Alert, 
  Spinner, Tabs, Tab, Card, Form
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getProductById } from '../api/product';
import { getVariantsByProduct } from '../api/variant';
import { getProductReviews, createReview } from '../api/review';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import ProductDetail from '../components/Product/ProductDetail';

import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewState, setReviewState] = useState({
    rating: 5,
    comment: '',
    isSubmitting: false,
    error: null,
    success: false
  });
  
  // Helper to safely format price (handles MongoDB Decimal128)
  const formatPrice = (price) => {
    if (!price) return '0.00';
    if (typeof price === 'object' && price.$numberDecimal) {
      return parseFloat(price.$numberDecimal).toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  };

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get product details
        const productData = await getProductById(id);
        setProduct(productData);
        
        // Fetch other data in parallel
        const [variantsData, reviewsData] = await Promise.allSettled([
          getVariantsByProduct(id),
          getProductReviews(id)
        ]);
        
        if (variantsData.status === 'fulfilled') {
          setVariants(variantsData.value.data || []);
        }
        
        if (reviewsData.status === 'fulfilled') {
          // Extract the reviews array from the response object
          setReviews(reviewsData.value.data || []);
        }
      } catch (err) {
        setError('Failed to load product. It may have been removed or is unavailable.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);
  
  // Calculate average rating
  const calculateAverageRating = () => {
    // Make sure reviews is an array and has elements
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };
  
  const averageRating = calculateAverageRating();
  
  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setReviewState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null,
      success: false
    }));
    
    try {
      await createReview({
        product_id: id,  // Changed from product to product_id
        rating: reviewState.rating,
        commentaire: reviewState.comment  // Changed from comment to commentaire
      });
      // Fetch latest reviews from backend to get correct user info
      const reviewsData = await getProductReviews(id);
      setReviews(reviewsData.data || []);
      // Reset form
      setReviewState({
        rating: 5,
        comment: '',
        isSubmitting: false,
        error: null,
        success: true
      });
    } catch (err) {
      setReviewState(prev => ({
        ...prev,
        isSubmitting: false,
        error: err.response?.data?.message || 'Failed to submit review. Please try again.'
      }));
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    navigate('/cart');
  };
  
  // Render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning" />);
    }
    
    // Add half star if needed
    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-warning" />);
    }
    
    return stars;
  };
  
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading product details...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" as={Link} to="/products">
              Go Back to Products
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  if (!product) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          Product not found.
          <div className="mt-3">
            <Button variant="primary" as={Link} to="/products">
              Go Back to Products
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5 product-page">
      {/* Product Hero Section */}
      <div className="product-hero-section mb-5 p-4 rounded-4 shadow-lg position-relative d-flex flex-column flex-md-row align-items-center justify-content-between" style={{background: 'linear-gradient(135deg, #232946 60%, #4a6bf5 100%)', minHeight: 320}}>
        <div className="product-hero-img-wrapper bg-white rounded-4 shadow-sm p-3 me-md-5 mb-4 mb-md-0" style={{maxWidth: 340, minWidth: 220}}>
          <img src={product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'} alt={product.name} className="img-fluid product-hero-img" style={{maxHeight: 260, objectFit: 'contain'}} />
        </div>
        <div className="flex-grow-1 text-center text-md-start d-flex flex-column align-items-center align-items-md-start justify-content-center">
          <h1 className="display-5 fw-bold text-white mb-2">{product.name}</h1>
          <div className="d-flex align-items-center mb-3 justify-content-center justify-content-md-start">
            <span className="me-2 fs-4 text-warning">{renderStarRating(averageRating)}</span>
            <span className="text-light fs-5">{averageRating.toFixed(1)} <span className="fs-6 text-muted">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span></span>
          </div>
          <div className="mb-3 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
            <span className="badge bg-success fs-6 px-3 py-2">{product.category?.name || 'Uncategorized'}</span>
            <span className="product-hero-price fw-bold" style={{fontSize:'2.2rem', color:'#00d4ff', background:'#181f2e', borderRadius:'1rem', padding:'0.3rem 1.2rem', boxShadow:'0 2px 12px rgba(0,212,255,0.10)'}}>${formatPrice(product.price)}</span>
          </div>
          {/* Add to Cart and Quantity Controls Inline */}
          <div className="w-100 d-flex flex-column flex-md-row align-items-center justify-content-md-start mt-2">
            <ProductDetail 
              product={product}
              variants={variants} 
              onAddToCart={handleAddToCart}
              hideMainInfo
            />
          </div>
        </div>
      </div>
      {/* Tabs for Description, Reviews, etc. */}
      <Row className="mt-5">
        <Col>
          <Tabs defaultActiveKey="reviews" className="mb-3 modern-tabs">
            <Tab eventKey="description" title="Description">
              <Card className="shadow-sm rounded-4">
                <Card.Body>
                  <p className="product-description fs-5 text-secondary">{product.description}</p>
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="reviews" title={`Reviews (${reviews.length})`}>
              <Card className="shadow-sm rounded-4">
                <Card.Body>
                  {/* Review Form */}
                  {isAuthenticated ? (
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3" style={{color:'white'}}>Write a Review</h5>
                      {reviewState.success && (
                        <Alert variant="success" dismissible onClose={() => setReviewState(prev => ({ ...prev, success: false }))}>
                          Your review has been submitted successfully!
                        </Alert>
                      )}
                      {reviewState.error && (
                        <Alert variant="danger" dismissible onClose={() => setReviewState(prev => ({ ...prev, error: null }))}>
                          {reviewState.error}
                        </Alert>
                      )}
                      <Form onSubmit={handleSubmitReview} className="review-form">
                        <Form.Group className="mb-3">
                          <Form.Label style={{marginRight:'1.5rem'}}>Rating</Form.Label>
                          <Form.Select 
                            value={reviewState.rating} 
                            onChange={(e) => setReviewState(prev => ({
                              ...prev,
                              rating: Number(e.target.value)
                            }))}
                            required
                          >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very Good</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Fair</option>
                            <option value="1">1 - Poor</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={3}
                            value={reviewState.comment}
                            onChange={(e) => setReviewState(prev => ({
                              ...prev,
                              comment: e.target.value
                            }))}
                            required
                          />
                        </Form.Group>
                        <Button 
                          type="submit" 
                          variant="primary"
                          disabled={reviewState.isSubmitting}
                        >
                          {reviewState.isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </Form>
                    </div>
                  ) : (
                    <Alert variant="info">
                      Please <Link to="/login">login</Link> to write a review.
                    </Alert>
                  )}
                  {/* Review List */}
                  <h5 className="fw-bold mt-4 mb-3" style={{color:'white'}}>Customer Reviews</h5>
                  {reviews.length === 0 ? (
                    <Alert variant="light">
                      No reviews yet. Be the first to review this product!
                    </Alert>
                  ) : (
                    <div className="review-list-modern">
                      {reviews.map((review) => (
                        <div key={review._id} className="review-item-modern mb-4 p-3 rounded-3 shadow-sm bg-white d-flex align-items-start gap-3">
                          <div className="review-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: 48, height: 48, fontSize: 22}}>
                            {review.user_id?.Firstname ? review.user_id.Firstname[0] : (review.user?.Firstname ? review.user.Firstname[0] : 'A')}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <div className="fw-semibold">{review.user_id?.Firstname || review.user?.Firstname || 'Anonymous'}</div>
                              <div className="text-warning fs-5">{renderStarRating(review.rating)}</div>
                            </div>
                            <div className="text-muted small mb-2">{new Date(review.createdAt).toLocaleDateString()}</div>
                            <div className="fs-6 text-dark">{review.commentaire || review.comment}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;