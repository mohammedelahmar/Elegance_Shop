import React, { useState } from 'react';
import { Row, Col, Image, Badge, ListGroup, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/action';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import Input from '../UI/Input';

// Add this helper function near the top of the component
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
  // Safely access addItem, or provide a fallback function
  const addItem = cart?.addItem || (async () => console.log('Cart context not available'));
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const availableStock = selectedVariant 
    ? (selectedVariant.stock || 0) 
    : (product?.stock_quantity || 0);

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
      
      if (window.confirm('Item added to cart. View cart now?')) {
        navigate('/cart');
      }
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Add user-friendly error notification here
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };
  
  const isOutOfStock = availableStock <= 0;

  return (
    <Row>
      {/* Only render controls, not image/name/price, when hideMainInfo is true */}
      <Col md={12} className="d-flex flex-column align-items-center justify-content-center">
        <Form className="mb-4 w-100 d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
          {variants && variants.length > 0 && (
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
          )}
          {/* Quantity inside Add to Cart button */}
          <div className="quantity-addtocart-group d-flex align-items-center bg-dark rounded-3 px-2 py-1" style={{boxShadow:'0 2px 8px rgba(74,107,245,0.10)'}}>
            <Button 
              variant="outline-light" 
              onClick={() => {
                const newQty = Math.max(1, quantity - 1);
                setQuantity(newQty);
              }}
              disabled={isOutOfStock}
              icon={FaMinus}
              className="quantity-btn"
              style={{border:'none', background:'none'}}
            />
            <input
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
              style={{width:48, background:'#f4f8ff', color:'#232946', border:'2px solid #4a6bf5', borderRadius:'0.7rem', fontWeight:'bold', fontSize:'1.2rem', textAlign:'center', margin:'0 0.5rem', boxShadow:'0 2px 8px rgba(74,107,245,0.08)'}}
            />
            <Button 
              variant="outline-light" 
              onClick={() => {
                const newQty = Math.min(availableStock, quantity + 1);
                setQuantity(newQty);
              }}
              disabled={isOutOfStock}
              icon={FaPlus}
              className="quantity-btn"
              style={{border:'none', background:'none'}}
            />
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              isLoading={adding}
              icon={FaShoppingCart}
              className="ms-3 px-4 fw-bold add-to-cart-main-btn"
              style={{borderRadius:'2rem', fontSize:'1.1rem', boxShadow:'0 4px 16px rgba(74,107,245,0.18)'}}
            >
              Add to Cart
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
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