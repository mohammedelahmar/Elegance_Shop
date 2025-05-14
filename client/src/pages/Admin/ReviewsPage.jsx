import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Tab, Tabs } from 'react-bootstrap';
import { FaSearch, FaSync, FaFilter } from 'react-icons/fa';
import { getAllReviews, deleteReview, updateReviewStatus } from '../../api/review';
import ReviewList from '../../components/Admin/Reviews/ReviewList';
import ReviewDetail from '../../components/Admin/Reviews/ReviewDetail';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import Message from '../../components/UI/Message';
import '../../components/Admin/Reviews/ReviewList.css';  // Import the new CSS

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [productFilter, setProductFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  
  // Review detail modal state
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewDetail, setShowReviewDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Fetch all reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllReviews();
        setReviews(data.data || []);
        setFilteredReviews(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [refreshTrigger]);

  // Filter reviews when tab changes or search term changes
  useEffect(() => {
    if (!reviews.length) return;
    
    let result = [...reviews];
    
    // Apply search term if any
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        review => 
          (review.user_id?.Firstname && review.user_id.Firstname.toLowerCase().includes(term)) ||
          (review.user_id?.Lastname && review.user_id.Lastname.toLowerCase().includes(term)) ||
          (review.commentaire && review.commentaire.toLowerCase().includes(term)) ||
          (review.product_id?.name && review.product_id.name.toLowerCase().includes(term))
      );
    }
    
    // Apply rating filter
    if (ratingFilter) {
      result = result.filter(review => review.rating === parseInt(ratingFilter));
    }
    
    // Apply product filter
    if (productFilter) {
      result = result.filter(review => 
        review.product_id && review.product_id._id === productFilter
      );
    }
    
    // Apply tab filter
    if (activeTab === 'highRating') {
      result = result.filter(review => review.rating >= 4);
    } else if (activeTab === 'lowRating') {
      result = result.filter(review => review.rating <= 2);
    }
    
    setFilteredReviews(result);
  }, [reviews, searchTerm, ratingFilter, productFilter, activeTab]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    setActionSuccess(null);
    setActionError(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowReviewDetail(true);
  };

  const handleCloseReviewDetail = () => {
    setShowReviewDetail(false);
    setSelectedReview(null);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        setActionLoading(true);
        setActionError(null);
        await deleteReview(reviewId);
        
        // Update the local state by removing the deleted review
        const updatedReviews = reviews.filter(review => review._id !== reviewId);
        setReviews(updatedReviews);
        
        setActionSuccess('Review deleted successfully');
      } catch (err) {
        setActionError(err.response?.data?.message || err.message);
      } finally {
        setActionLoading(false);
        
        // Close the modal if we're deleting the currently viewed review
        if (selectedReview && selectedReview._id === reviewId) {
          handleCloseReviewDetail();
        }
      }
    }
  };

  const handleApproveReview = async (reviewId) => {
    try {
      setActionLoading(true);
      setActionError(null);
      await updateReviewStatus(reviewId, { approved: true });
      
      // Update the local state
      const updatedReviews = reviews.map(review =>
        review._id === reviewId ? { ...review, approved: true } : review
      );
      setReviews(updatedReviews);
      
      // If we're viewing the review details, update the selected review too
      if (selectedReview && selectedReview._id === reviewId) {
        setSelectedReview({
          ...selectedReview,
          approved: true
        });
      }
      
      setActionSuccess('Review approved successfully');
    } catch (err) {
      setActionError(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRatingFilter('');
    setProductFilter('');
    setActiveTab('all');
  };

  // Get unique products from reviews for filter dropdown
  const uniqueProducts = [...new Map(
    reviews
      .filter(review => review.product_id)
      .map(review => [review.product_id._id, review.product_id])
  ).values()];

  return (
    <Container fluid className="py-3" style={{ background: '#111827', minHeight: '100vh', color: '#fff' }}>
      {/* Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="h3 mb-0 review-page-header">Review Management</h1>
        </Col>
        <Col xs="auto">
          <Button 
            className="review-btn-primary"
            variant="primary" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <FaSync /> Refresh
          </Button>
        </Col>
      </Row>

      {/* Action messages */}
      {actionSuccess && (
        <Message 
          variant="success" 
          dismissible 
          onClose={() => setActionSuccess(null)}
          className="mb-4"
        >
          {actionSuccess}
        </Message>
      )}
      
      {actionError && (
        <Message 
          variant="danger" 
          dismissible 
          onClose={() => setActionError(null)}
          className="mb-4"
        >
          {actionError}
        </Message>
      )}

      <div className="review-list-card">
        {/* Search and Filters */}
        <div className="review-search-bar">
          <Row className="align-items-center">
            <Col md={4} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text className="review-search-icon">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="review-search-input"
                />
              </InputGroup>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Select 
                    value={ratingFilter} 
                    onChange={e => setRatingFilter(e.target.value)}
                    className="review-filter-select"
                  >
                    <option value="">Filter by Rating</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </Form.Select>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Select 
                    value={productFilter} 
                    onChange={e => setProductFilter(e.target.value)}
                    className="review-filter-select"
                  >
                    <option value="">Filter by Product</option>
                    {uniqueProducts.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4} className="text-md-end">
                  <Button 
                    variant="outline-primary" 
                    onClick={clearFilters}
                    className="w-100"
                  >
                    <FaFilter /> Clear Filters
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        {/* Status Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 review-tabs"
        >
          <Tab eventKey="all" title="All Reviews" />
          <Tab eventKey="highRating" title="High Ratings (4-5)" />
          <Tab eventKey="lowRating" title="Low Ratings (1-2)" />
        </Tabs>

        {/* Reviews List */}
        {loading ? (
          <LoadingAnimation text="Loading reviews..." />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center p-5">
            <h3 className="text-muted">No reviews found</h3>
            <p>No reviews match your current filters.</p>
          </div>
        ) : (
          <div>
            <ReviewList
              reviews={filteredReviews}
              onViewReview={handleViewReview}
              onDeleteReview={handleDeleteReview}
              onApproveReview={handleApproveReview}
              isLoading={actionLoading}
            />
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <ReviewDetail
          review={selectedReview}
          show={showReviewDetail}
          onHide={handleCloseReviewDetail}
          onDeleteReview={handleDeleteReview}
          onApproveReview={handleApproveReview}
          isLoading={actionLoading}
        />
      )}
    </Container>
  );
};

export default ReviewsPage;