import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Badge, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/action';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaPlus, FaMinus, FaCheckCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import Input from '../UI/Input';
import WishlistButton from '../wishlist/WishlistButton';
import { motion, AnimatePresence } from 'framer-motion'; // Add this import for animations
import './ProductDetail.css'; // Create this file for the animations

// Helper function for price formatting
const formatPrice = (price) => {
  if (!price) return '0.00';
  
  // Handle Decimal128 format from MongoDB
  if (typeof price === 'object' && price.$numberDecimal) {
    return parseFloat(price.$numberDecimal).toFixed(2);
  }
  
  // Handle regular number or string
  return parseFloat(price).toFixed(2);
};

const ProductDetail = ({ product, variants, onAddToCart, hideMainInfo }) => {
  const dispatch = useDispatch();
  const cart = useCart();
  const addItem = cart?.addItem || (async () => console.log('Cart context not available'));
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const availableStock = selectedVariant 
    ? (selectedVariant.stock || 0) 
    : (product?.stock_quantity || 0);

  // Fade-in animation on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value < 1) setQuantity(1);
    else if (value > availableStock) setQuantity(availableStock);
    else setQuantity(value);
  };
  
  const handleVariantChange = (e) => {
    const variantId = e.target.value;
    if (variantId === '') {
      setSelectedVariant(null);
      return;
    }
    
    const variant = variants?.find(v => v._id === variantId);
    setSelectedVariant(variant);
    
    if (variant && variant.stock > 0) {
      setQuantity(Math.min(quantity, variant.stock));
    } else {
      setQuantity(1);
    }
  };
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    setAdding(true);
    
    try {
      const itemToAdd = {
        id: product._id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity
      };
      
      if (selectedVariant) {
        itemToAdd.variantId = selectedVariant._id;
        itemToAdd.variantName = `${selectedVariant.taille || ''} ${selectedVariant.couleur || ''}`.trim();
        itemToAdd.price = selectedVariant.price || product.price;
      }
      
      dispatch(addToCart(itemToAdd));
      
      // Use the safe version of addItem 
      if (cart) {
        await addItem(
          product._id, 
          quantity, 
          selectedVariant ? selectedVariant._id : null
        );
      }
      
      if (onAddToCart) {
        onAddToCart(itemToAdd);
      }
      
      // Show success animation instead of alert
      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
        // Only show the prompt after the success animation completes
        setTimeout(() => {
          if (window.confirm('Item added to cart. View cart now?')) {
            navigate('/cart');
          }
        }, 300);
      }, 1500);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };
  
  const isOutOfStock = availableStock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <Row>
        <Col md={12} className="d-flex flex-column align-items-center justify-content-center">
          {/* Wishlist button with hover animation */}
          <motion.div 
            className="d-flex justify-content-end w-100 mb-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <WishlistButton productId={product._id} size="lg" />
          </motion.div>
          
          <Form className="mb-4 w-100 d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
            {variants && variants.length > 0 && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-100"
                style={{ maxWidth: "250px" }}
              >
                <Input
                  label="Variant"
                  as="select"
                  onChange={handleVariantChange}
                  value={selectedVariant?._id || ''}
                  options={[
                    { value: '', label: 'Select Variant' },
                    ...variants.map(variant => ({
                      value: variant._id,
                      label: `${variant.taille || ''} ${variant.couleur || ''} ${variant.stock <= 0 ? '(Out of Stock)' : ''}`,
                      disabled: variant.stock <= 0
                    }))
                  ]}
                  className="mb-0 variant-select"
                />
              </motion.div>
            )}
            
            {/* Quantity controls with animations */}
            <motion.div 
              className="quantity-addtocart-group d-flex align-items-center bg-dark rounded-4 px-3 py-2"
              style={{
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                border: '1px solid rgba(74,107,245,0.2)',
                background: 'linear-gradient(145deg, #1a1f35 0%, #232946 100%)'
              }}
              whileHover={{ boxShadow: '0 10px 25px rgba(74,107,245,0.25)' }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  variant="outline-light" 
                  onClick={() => {
                    const newQty = Math.max(1, quantity - 1);
                    setQuantity(newQty);
                  }}
                  disabled={isOutOfStock}
                  className="quantity-btn"
                  style={{
                    border: 'none', 
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FaMinus size={14} />
                </Button>
              </motion.div>
              
              <motion.input
                type="number"
                min="1"
                max={availableStock}
                value={quantity}
                onChange={e => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  if (val > availableStock) val = availableStock;
                  setQuantity(val);
                }}
                disabled={isOutOfStock}
                className="mx-2 text-center quantity-input"
                style={{
                  width: 56, 
                  background: 'rgba(244,248,255,0.9)',
                  color: '#232946', 
                  border: '2px solid #4a6bf5',
                  borderRadius: '0.9rem',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  margin: '0 0.7rem',
                  boxShadow: '0 4px 12px rgba(74,107,245,0.15)',
                  transition: 'all 0.3s ease'
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  variant="outline-light" 
                  onClick={() => {
                    const newQty = Math.min(availableStock, quantity + 1);
                    setQuantity(newQty);
                  }}
                  disabled={isOutOfStock}
                  className="quantity-btn"
                  style={{
                    border: 'none', 
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FaPlus size={14} />
                </Button>
              </motion.div>
              
              <motion.div
                className="ms-4"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || adding}
                  isLoading={adding && !addSuccess}
                  className="px-4 fw-bold add-to-cart-main-btn"
                  style={{
                    borderRadius: '2rem',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 20px rgba(74,107,245,0.25)',
                    background: 'linear-gradient(135deg, #4a6bf5 0%, #6578f2 100%)',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <AnimatePresence>
                    {addSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FaCheckCircle className="me-2" size={18} />
                        Added!
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cart"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FaShoppingCart className="me-2" size={18} />
                        Add to Cart
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </Form>
        </Col>
      </Row>
    </motion.div>
  );
};

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
  variants: PropTypes.array,
  onAddToCart: PropTypes.func,
  hideMainInfo: PropTypes.bool
};

ProductDetail.defaultProps = {
  variants: [],
  onAddToCart: null,
  hideMainInfo: false
};

export default ProductDetail;