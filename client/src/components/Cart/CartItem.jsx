import React, { useState, useRef } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Button from '../UI/Button';
import Input from '../UI/Input';
import './CartItem.css';

// Import COMMON_COLORS at the top of the file
import { COMMON_COLORS } from '../../constants/sizes';

const getColorStyle = (colorName) => {
  if (!colorName) return {};
  
  const colorEntry = COMMON_COLORS.find(c => 
    c.value.toLowerCase() === colorName.toLowerCase() || 
    c.label.toLowerCase() === colorName.toLowerCase()
  );
  return {
    backgroundColor: colorEntry ? colorEntry.hex : colorName,
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "1px solid #ddd"
  };
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const itemRef = useRef(null);

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
    setIsRemoving(true);
    try {
      if (itemRef.current) {
        itemRef.current.classList.add('removing');
        // Wait for animation to complete before removing
        setTimeout(async () => {
          await onRemove(item._id);
        }, 500);
      } else {
        await onRemove(item._id);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      setIsRemoving(false);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      ref={itemRef}
    >
      <Row className="cart-item align-items-center">
        {/* Product image */}
        <Col xs={3} md={2}>
          <Link to={productUrl}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <Image src={productImageUrl} alt={productName} fluid rounded className="cart-item-image" />
            </motion.div>
          </Link>
        </Col>

        {/* Product info */}
        <Col xs={9} md={4}>
          <Link to={productUrl} className="text-decoration-none">
            <motion.h5 
              className="cart-item-title mb-1"
              whileHover={{ color: "#ff85a1" }}
              transition={{ duration: 0.2 }}
            >
              {productName}
            </motion.h5>
          </Link>
          {item.variant && (
            <p className="text-white-50 mb-0 small">
              Variant: <span className="badge bg-secondary bg-opacity-25">{item.variant.taille} {item.variant.couleur}</span>
            </p>
          )}
          {item.variant_id && (
            <div className="d-flex align-items-center mb-2">
              <p className="text-muted mb-0 small me-2">
                <strong>Size:</strong> {item.variant_id.taille}
              </p>
              {item.variant_id.couleur && (
                <div className="d-flex align-items-center">
                  <span className="text-muted small me-1"><strong>Color:</strong></span>
                  <div
                    className="color-swatch"
                    style={getColorStyle(item.variant_id.couleur)}
                    title={item.variant_id.couleur}
                  ></div>
                </div>
              )}
            </div>
          )}
          <Button 
            variant="link" 
            className="text-danger p-0 mt-2 d-md-none" 
            onClick={handleRemoveItem}
            disabled={isRemoving}
            icon={FaTrash}
            size="sm"
          >
            Remove
          </Button>
        </Col>

        {/* Quantity controls */}
        <Col xs={6} md={3} className="mt-3 mt-md-0">
          <motion.div 
            className="quantity-control"
            whileHover={{ boxShadow: '0 4px 12px rgba(244,93,160,0.15)' }}
          >
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => handleQuantityUpdate(quantity - 1)} 
              disabled={quantity <= 1 || isUpdating || isRemoving}
              icon={FaMinus}
              className="rounded-circle"
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
              disabled={isUpdating || isRemoving}
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
            />
            
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => handleQuantityUpdate(quantity + 1)}
              disabled={isUpdating || isRemoving}
              icon={FaPlus}
              className="rounded-circle"
            />
          </motion.div>
        </Col>

        {/* Price */}
        <Col xs={6} md={2} className="text-end">
          <motion.h5 
            className="cart-item-price mb-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ${totalPrice.toFixed(2)}
          </motion.h5>
          <small className="cart-item-unit-price">${productPrice.toFixed(2)} each</small>
        </Col>

        {/* Remove button (desktop) */}
        <Col md={1} className="text-end d-none d-md-block">
          <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleRemoveItem}
              disabled={isRemoving}
              title="Remove item"
              className="cart-item-remove"
              icon={FaTrash}
            />
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default CartItem;