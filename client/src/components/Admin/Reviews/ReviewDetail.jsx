import React from 'react';
import { Modal, Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { FaTrash, FaCheck, FaStar, FaRegStar, FaUser, FaBox, FaCalendar } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './ReviewDetail.css'; // Import the new CSS file

const ReviewDetail = ({ review, show, onHide, onDeleteReview, onApproveReview, isLoading }) => {
  if (!review) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Function to render star ratings
  const renderStarRating = (rating) => {
    const stars = [];
    const maxRating = 5;
    
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <span key={i} className="me-1">
          {i <= rating ? 
            <FaStar className="text-warning" size={24} /> : 
            <FaRegStar className="text-muted" size={24} />
          }
        </span>
      );
    }
    
    return <div className="d-flex">{stars}</div>;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      dialogClassName="review-detail-modal" // Add the custom class for styling
    >
      <Modal.Header closeButton>
        <Modal.Title>Review Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col xs={12} className="mb-3">
            <Card /* className="bg-light" - remove this or adjust in CSS */ >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">Rating</h5>
                  <Badge 
                    bg={
                      review.rating >= 4 ? 'success' : 
                      review.rating >= 3 ? 'warning' : 
                      'danger'
                    }
                    className="fs-6 px-3 py-2"
                  >
                    {review.rating}/5
                  </Badge>
                </div>
                {renderStarRating(review.rating)}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-3">
            <Card className="h-100">
              <Card.Header className="d-flex align-items-center">
                <FaUser className="me-2" /> Reviewer Information
              </Card.Header>
              <Card.Body>
                <p><strong>Name:</strong> {review.user_id ? `${review.user_id.Firstname} ${review.user_id.Lastname}` : 'Unknown'}</p>
                <p><strong>Email:</strong> {review.user_id?.email || 'N/A'}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-3">
            <Card className="h-100">
              <Card.Header className="d-flex align-items-center">
                <FaBox className="me-2" /> Product Information
              </Card.Header>
              <Card.Body>
                <p><strong>Product:</strong> {review.product_id?.name || 'Unknown Product'}</p>
                {review.product_id?.image_url && (
                  <img
                    src={review.product_id.image_url}
                    alt={review.product_id.name}
                    className="img-thumbnail"
                    style={{ maxHeight: "100px" }}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12}>
            <Card>
              <Card.Header className="d-flex align-items-center">
                <FaCalendar className="me-2" /> Review Details
              </Card.Header>
              <Card.Body>
                <p><strong>Date Submitted:</strong> {formatDate(review.createdAt)}</p>
                <p><strong>Status:</strong> {review.approved ? 
                  <Badge bg="success">Approved</Badge> : 
                  <Badge bg="warning" text="dark">Pending Approval</Badge>
                }</p>
                <hr style={{ borderColor: '#2b354f' }} /> {/* Styled HR */}
                <h5>Comment</h5>
                <div className="review-comment-section">{review.commentaire || review.comment}</div>
                
                {/* Display review image if available */}
                {(review.imageUrl || review.image_url) && (
                  <>
                    <hr style={{ borderColor: '#2b354f' }} /> {/* Styled HR */}
                    <h5>Attached Image</h5>
                    <div className="text-center my-3">
                      <img 
                        src={review.imageUrl || review.image_url} 
                        alt="Review" 
                        className="img-fluid rounded" 
                        style={{ maxHeight: "300px" }} 
                      />
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <Button 
            variant="danger" 
            onClick={() => onDeleteReview(review._id)}
            disabled={isLoading}
            className="review-detail-btn"
          >
            <FaTrash className="me-2" /> Delete Review
          </Button>
          <div>
            <Button 
              variant="secondary" 
              onClick={onHide}
              className="me-2 review-detail-btn"
              disabled={isLoading}
            >
              Close
            </Button>
            {!review.approved && (
              <Button 
                variant="success" 
                onClick={() => onApproveReview(review._id)}
                disabled={isLoading}
                className="review-detail-btn"
              >
                <FaCheck className="me-2" /> Approve Review
              </Button>
            )}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

ReviewDetail.propTypes = {
  review: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onDeleteReview: PropTypes.func.isRequired,
  onApproveReview: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ReviewDetail;