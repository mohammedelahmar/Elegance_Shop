import React from 'react';
import { ListGroup, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import Button from '../UI/Button';
import { FaShoppingCart } from 'react-icons/fa';

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
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center my-5">
        <FaShoppingCart size={50} className="text-muted mb-3" />
        <h4>Your cart is empty</h4>
        <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
        <Button 
          as={Link} 
          to="/products" 
          variant="primary"
          icon={FaShoppingCart}
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <ListGroup variant="flush" className="cart-list">
      {cartItems.map((item) => (
        <ListGroup.Item key={item._id} className="px-0">
          <CartItem 
            item={item} 
            onUpdateQuantity={onUpdateQuantity} 
            onRemove={onRemoveItem} 
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default CartList;