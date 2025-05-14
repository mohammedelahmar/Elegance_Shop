import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaImage } from 'react-icons/fa';
import PropTypes from 'prop-types';
import LoadingAnimation from '../../common/LoadingAnimation';

const RecentReviews = ({ reviews, loading }) => {
  if (loading) {
    return (
      <div className="py-4 text-center">
        <LoadingAnimation size="small" text="Loading reviews..." />
      </div>
    );
  }

  if (!reviews.length) {
    return <p className="text-muted text-center">No recent reviews</p>;
  }

  const renderStars = (rating) => {
    return (
      <div className="d-flex">
        {[...Array(5)].map((_, index) => (
          <FaStar 
            key={index} 
            className={index < rating ? "text-warning" : "text-muted opacity-25"} 
            size={14} 
          />
        ))}
      </div>
    );
  };
  
  return (
    <ListGroup variant="flush">
      {reviews.map(review => (
        <ListGroup.Item 
          key={review._id} 
          className="py-3 px-0 border-bottom"
        >
          <div className="d-flex justify-content-between mb-1">
            <Link 
              to={`/admin/reviews?id=${review._id}`} 
              className="fw-medium text-decoration-none"
            >
              {review.product_id?.name || 'Product'}
            </Link>
            {!review.approved && (
              <Badge bg="warning" text="dark">Pending</Badge>
            )}
          </div>
          
          <div className="mb-2">
            {renderStars(review.rating)}
          </div>
          
          <p className="mb-1 text-truncate">
            {review.commentaire || review.comment}
            {(review.imageUrl || review.image_url) && (
              <span className="ms-2 badge bg-info">
                <FaImage size={12} className="me-1" /> Image
              </span>
            )}
          </p>
          
          <div className="d-flex justify-content-between">
            <small className="text-muted">
              By {review.user_id?.Firstname || 'Anonymous'}
            </small>
            <small className="text-muted">
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

RecentReviews.propTypes = {
  reviews: PropTypes.array.isRequired,
  loading: PropTypes.bool
};

RecentReviews.defaultProps = {
  loading: false
};

export default RecentReviews;