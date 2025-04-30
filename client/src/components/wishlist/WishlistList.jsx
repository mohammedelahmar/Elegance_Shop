import React from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import WishlistItem from './WishlistItem';
import { FaHeart, FaShoppingBag } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const WishlistList = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading wishlist: {error}
      </Alert>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center my-5">
        <FaHeart size={50} className="text-muted mb-3" />
        <h4>Your wishlist is empty</h4>
        <p className="text-muted mb-4">Save items you love to your wishlist. Review them anytime and easily move them to your cart.</p>
        <Button 
          as={Link} 
          to="/products" 
          variant="primary"
          icon={FaShoppingBag}
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="wishlist-list">
      {products.map((product) => (
        <WishlistItem key={product._id} product={product} />
      ))}
    </div>
  );
};

WishlistList.propTypes = {
  products: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string
};

WishlistList.defaultProps = {
  products: [],
  loading: false,
  error: null
};

export default WishlistList;