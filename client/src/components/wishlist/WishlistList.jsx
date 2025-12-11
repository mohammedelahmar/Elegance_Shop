import React from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WishlistItem from './WishlistItem';
import { FaHeart, FaShoppingBag } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const WishlistList = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center my-5 py-4">
        <Spinner animation="border" variant="primary" style={{ 
          width: "3rem", 
          height: "3rem",
          borderWidth: "0.3rem",
          color: "#ff85a1"
        }} />
        <p className="mt-3 text-white-50">Loading your wishlist items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="d-flex align-items-center" style={{
        background: "rgba(233, 69, 96, 0.2)",
        borderColor: "rgba(233, 69, 96, 0.4)",
        color: "#f8f9fa"
      }}>
        <div className="me-3">❌</div>
        <div>
          <p className="mb-0"><strong>Error loading wishlist</strong></p>
          <p className="mb-0 small">{error}</p>
        </div>
      </Alert>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div 
        className="text-center my-5 py-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="empty-wishlist-icon mb-4">
          <FaHeart size={60} />
        </div>
        <h4 className="text-white">Your wishlist is empty</h4>
        <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: '500px' }}>
          Save items you love to your wishlist. Review them anytime and easily move them to your cart.
        </p>
        <Button 
          as={Link} 
          to="/products" 
          variant="primary"
          style={{
            background: "linear-gradient(135deg, #f45da0 0%, #ff85a1 100%)",
            border: "none",
            borderRadius: "8px",
            padding: "0.6rem 1.5rem"
          }}
        >
          <FaShoppingBag className="me-2" />
          Discover Products
        </Button>
      </motion.div>
    );
  }

  // If we have products, render the list with animations
  return (
    <motion.div 
      className="wishlist-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <WishlistItem product={product} />
        </motion.div>
      ))}
    </motion.div>
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