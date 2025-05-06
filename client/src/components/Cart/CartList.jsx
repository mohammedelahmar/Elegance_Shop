import React from 'react';
import { ListGroup, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CartItem from './CartItem';
import Button from '../UI/Button';
import { FaShoppingCart, FaShoppingBag } from 'react-icons/fa';

const CartList = ({ 
  cartItems, 
  loading, 
  error, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) => {
  if (loading) {
    return (
      <div className="text-center my-5 py-4">
        <div className="position-relative d-inline-block">
          <Spinner 
            animation="border" 
            variant="primary" 
            style={{ 
              width: "3rem", 
              height: "3rem",
              borderWidth: "0.3rem",
              color: "#4a9fff"
            }}
          />
          <div className="spinner-glow"></div>
        </div>
        <p className="mt-3 text-white-50">Loading your cart...</p>
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
          <p className="mb-0"><strong>Error loading cart</strong></p>
          <p className="mb-0 small">{error}</p>
        </div>
      </Alert>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <motion.div 
        className="text-center my-5 py-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="empty-cart-icon mb-4">
          <FaShoppingCart size={60} />
        </div>
        <h4 className="text-white">Your cart is empty</h4>
        <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: '500px' }}>
          Looks like you haven't added any items to your cart yet. 
          Browse our products and find something you love!
        </p>
        <Button 
          as={Link} 
          to="/products" 
          variant="primary"
          style={{
            background: "linear-gradient(135deg, #4a6bf5 0%, #6578f2 100%)",
            border: "none",
            borderRadius: "8px",
            padding: "0.6rem 1.5rem"
          }}
        >
          <FaShoppingBag className="me-2" />
          Browse Products
        </Button>
      </motion.div>
    );
  }

  return (
    <ListGroup variant="flush" className="cart-list">
      <AnimatePresence>
        {cartItems.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ListGroup.Item className="px-0" style={{ background: 'transparent' }}>
              <CartItem 
                item={item} 
                onUpdateQuantity={onUpdateQuantity} 
                onRemove={onRemoveItem} 
              />
            </ListGroup.Item>
          </motion.div>
        ))}
      </AnimatePresence>
    </ListGroup>
  );
};

export default CartList;