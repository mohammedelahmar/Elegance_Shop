import React from 'react';
import { Table, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { FaEye, FaCheck, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ReviewList = ({ reviews, onViewReview, onDeleteReview, onApproveReview, isLoading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Function to render star ratings
  const renderStarRating = (rating) => {
    const stars = [];
    const maxRating = 5;
    
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <span key={i} className="me-1">
          {i <= rating ? 
            <FaStar className="text-warning" /> : 
            <FaRegStar className="text-muted" />
          }
        </span>
      );
    }
    
    return <div className="d-flex">{stars}</div>;
  };

  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead className="bg-light">
          <tr>
            <th>Product</th>
            <th>User</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              <td>
                <div className="d-flex align-items-center">
                  {review.product_id?.image_url && (
                    <img
                      src={review.product_id.image_url}
                      alt={review.product_id.name}
                      width="40"
                      height="40"
                      className="me-2 rounded object-fit-cover"
                    />
                  )}
                  <span>{review.product_id?.name || 'Unknown Product'}</span>
                </div>
              </td>
              <td>
                {review.user_id ? (
                  <div>
                    <div>{`${review.user_id.Firstname || ''} ${review.user_id.Lastname || ''}`}</div>
                    <small className="text-muted">{review.user_id.email}</small>
                  </div>
                ) : (
                  'Unknown User'
                )}
              </td>
              <td>
                {renderStarRating(review.rating)}
              </td>
              <td>
                <div className="text-truncate" style={{ maxWidth: '200px' }}>
                  {review.commentaire}
                </div>
              </td>
              <td>{review.createdAt ? formatDate(review.createdAt) : 'N/A'}</td>
              <td>
                <ButtonGroup>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onViewReview(review)}
                    title="View Review Details"
                  >
                    <FaEye />
                  </Button>
                  {!review.approved && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => onApproveReview(review._id)}
                      disabled={isLoading}
                      title="Approve Review"
                    >
                      <FaCheck />
                    </Button>
                  )}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDeleteReview(review._id)}
                    disabled={isLoading}
                    title="Delete Review"
                  >
                    <FaTrash />
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.array.isRequired,
  onViewReview: PropTypes.func.isRequired,
  onDeleteReview: PropTypes.func.isRequired,
  onApproveReview: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ReviewList;