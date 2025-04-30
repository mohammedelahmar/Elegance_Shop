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
import { debounce } from 'lodash';

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
  
  // Create debounced submit function
  const debouncedSubmit = debounce(async (formData) => {
    // Submit logic here
  }, 300);
  
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
          setVariants(variantsData.value);
        }
        
        if (reviewsData.status === 'fulfilled') {
          setReviews(reviewsData.value);
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
    if (!reviews || reviews.length === 0) return 0;
    
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
      const newReview = await createReview({
        product: id,
        rating: reviewState.rating,
        comment: reviewState.comment
      });
      
      // Add new review to the reviews list
      setReviews([newReview, ...reviews]);
      
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
      {/* Breadcrumb navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>
      
      {/* Product rating display */}
      <div className="d-flex mb-3 align-items-center">
        <div className="me-2">
          {renderStarRating(averageRating)}
        </div>
        <span className="text-muted">
          {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
        </span>
      </div>
      
      {/* Product Detail Component */}
      <ProductDetail 
        product={product} 
        variants={variants} 
        onAddToCart={handleAddToCart}
      />
      
      {/* Tabs for Description, Reviews, etc. */}
      <Row className="mt-5">
        <Col>
          <Tabs defaultActiveKey="reviews" className="mb-3">
            <Tab eventKey="description" title="Description">
              <Card>
                <Card.Body>
                  <p>{product.description}</p>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="reviews" title={`Reviews (${reviews.length})`}>
              <Card>
                <Card.Body>
                  {/* Review Form */}
                  {isAuthenticated ? (
                    <div className="mb-4">
                      <h5>Write a Review</h5>
                      
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
                      
                      <Form onSubmit={handleSubmitReview}>
                        <Form.Group className="mb-3">
                          <Form.Label>Rating</Form.Label>
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
                  <h5>Customer Reviews</h5>
                  
                  {reviews.length === 0 ? (
                    <Alert variant="light">
                      No reviews yet. Be the first to review this product!
                    </Alert>
                  ) : (
                    reviews.map((review) => (
                      <div key={review._id} className="review-item mb-3">
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{review.user?.Firstname || 'Anonymous'}</strong>
                            <div className="text-muted small">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            {renderStarRating(review.rating)}
                          </div>
                        </div>
                        <p className="mt-2">{review.comment}</p>
                        <hr />
                      </div>
                    ))
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