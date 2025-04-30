import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const WishlistButton = ({ productId, size = "sm", className = "" }) => {
  const [processing, setProcessing] = useState(false);
  const { isInWishlist, toggleItem } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const isLiked = isInWishlist(productId);
  
  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login?redirect=wishlist');
      return;
    }
    
    setProcessing(true);
    try {
      await toggleItem(productId);
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
      className={className}
      onClick={handleToggleWishlist}
      isLoading={processing}
      title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
      icon={isLiked ? FaHeart : FaRegHeart}
    />
  );
};

WishlistButton.propTypes = {
  productId: PropTypes.string.isRequired,
  size: PropTypes.string,
  className: PropTypes.string
};

export default WishlistButton;