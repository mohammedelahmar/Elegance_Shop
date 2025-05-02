import React, { useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import Button from '../UI/Button';
import Input from '../UI/Input';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityUpdate = async (newQuantity) => {
    if (newQuantity !== item.quantity && newQuantity > 0) {
      setIsUpdating(true);
      try {
        await onUpdateQuantity(item._id, newQuantity);
        setQuantity(newQuantity);
      } catch (error) {
        console.error('Failed to update quantity:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleRemoveItem = async () => {
    try {
      await onRemove(item._id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const productUrl = `/products/${item.product_id?._id || item.product_id}`;
  const productImageUrl = item.product_id?.image_url || 'https://via.placeholder.com/100x100?text=No+Image';
  const productName = item.product_id?.name || 'Unknown Product';

  const getProductPrice = () => {
    if (!item.product_id?.price) return 0;
    
    if (typeof item.product_id.price === 'object' && item.product_id.price.$numberDecimal) {
      return parseFloat(item.product_id.price.$numberDecimal);
    }
    
    return parseFloat(item.product_id.price) || 0;
  };

  const productPrice = getProductPrice();
  const totalPrice = productPrice * quantity;

  return (
    <Row className="cart-item align-items-center py-3 border-bottom">
      <Col xs={3} md={2}>
        <Link to={productUrl}>
          <Image src={productImageUrl} alt={productName} fluid rounded className="cart-item-image" />
        </Link>
      </Col>

      <Col xs={9} md={4}>
        <Link to={productUrl} className="text-decoration-none text-dark">
          <h5 className="mb-1">{productName}</h5>
        </Link>
        {item.variant && (
          <p className="text-muted mb-0 small">
            Variant: {item.variant.taille} {item.variant.couleur}
          </p>
        )}
        <Button 
          variant="link" 
          className="text-danger p-0 mt-2 d-md-none" 
          onClick={handleRemoveItem}
          icon={FaTrash}
          size="sm"
        >
          Remove
        </Button>
      </Col>

      <Col xs={6} md={3} className="mt-3 mt-md-0">
        <div className="d-flex align-items-center quantity-control">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={() => handleQuantityUpdate(quantity - 1)} 
            disabled={quantity <= 1 || isUpdating}
            icon={FaMinus}
          />
          
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={() => handleQuantityUpdate(quantity)}
            className="mx-2"
            inputClassName="text-center"
            fullWidth={false}
            disabled={isUpdating}
          />
          
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={() => handleQuantityUpdate(quantity + 1)}
            disabled={isUpdating}
            icon={FaPlus}
          />
        </div>
      </Col>

      <Col xs={6} md={2} className="text-end">
        <h5 className="mb-0">${totalPrice.toFixed(2)}</h5>
        <small className="text-muted">${productPrice.toFixed(2)} each</small>
      </Col>

      <Col md={1} className="text-end d-none d-md-block">
        <Button 
          variant="outline-danger" 
          size="sm" 
          onClick={handleRemoveItem}
          title="Remove item"
          icon={FaTrash}
        />
      </Col>
    </Row>
  );
};

export default CartItem;