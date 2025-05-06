import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import './WishlistButton.css';

const WishlistButton = ({ productId, size = "sm", className = "" }) => {
  const [processing, setProcessing] = useState(false);
  const { isInWishlist, toggleItem } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const isLiked = isInWishlist(productId);
  
  const handleToggleWishlist = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isAuthenticated) {
      navigate('/login?redirect=wishlist');
      return;
    }
    
    setProcessing(true);
    try {
      console.log(`Toggling product ${productId} in wishlist`); // Debug log
      const result = await toggleItem(productId);
      console.log("Toggle result:", result); // Debug log
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Button
      variant={isLiked ? "danger" : "outline-danger"}
      size={size}
      className={`wishlist-btn ${className}`}
      onClick={handleToggleWishlist}
      isLoading={processing}
      title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLiked ? <FaHeart /> : <FaRegHeart />}
    </Button>
  );
};

WishlistButton.propTypes = {
  productId: PropTypes.string.isRequired,
  size: PropTypes.string,
  className: PropTypes.string
};

export default WishlistButton;