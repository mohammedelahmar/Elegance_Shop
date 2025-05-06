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
import WishlistButton from '../wishlist/WishlistButton';

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

const ProductDetail = ({ product, variants, onAddToCart }) => {
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
      <Col md={5} className="mb-4">
        <div className="product-image-container">
          <Image 
            src={product.image_url || 'https://via.placeholder.com/500x500?text=No+Image'} 
            alt={product.name}
            className="product-detail-image"
            fluid
          />
        </div>
      </Col>
      
      <Col md={7}>
        <div className="d-flex justify-content-between align-items-start">
          <h1 className="mb-2">{product.name}</h1>
          <WishlistButton productId={product._id} size="lg" />
        </div>
        
        <h2 className="product-price mb-3">
          ${selectedVariant ? formatPrice(selectedVariant.price || product.price) : formatPrice(product.price)}
        </h2>
        
        {isOutOfStock ? (
          <Badge bg="danger" className="mb-3 fs-6">Out of Stock</Badge>
        ) : (
          <Badge bg="success" className="mb-3 fs-6">In Stock</Badge>
        )}
        
        <div className="mb-4 product-description">
          <p>{product.description || 'No description available.'}</p>
        </div>
        
        <Form className="mb-4">
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
              className="mb-3"
            />
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <div className="d-flex align-items-center quantity-selector">
              <Button 
                variant="outline-secondary" 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={isOutOfStock}
                icon={FaMinus}
              />
              <Input
                type="number"
                min="1"
                max={availableStock}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={isOutOfStock}
                className="mx-2"
                inputClassName="text-center"
                fullWidth={false}
              />
              <Button 
                variant="outline-secondary" 
                onClick={() => setQuantity(prev => Math.min(availableStock, prev + 1))}
                disabled={isOutOfStock}
                icon={FaPlus}
              />
            </div>
          </Form.Group>
          
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            isLoading={adding}
            icon={FaShoppingCart}
            fullWidth
          >
            Add to Cart
          </Button>
        </Form>
        
        <ListGroup variant="flush" className="product-details-list">
          <ListGroup.Item>
            <strong>Category:</strong> {product.category?.name || 'Uncategorized'}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Availability:</strong> {isOutOfStock ? 'Out of Stock' : 'In Stock'}
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
};

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
  variants: PropTypes.array,
  onAddToCart: PropTypes.func
};

ProductDetail.defaultProps = {
  variants: [],
  onAddToCart: null
};

export default ProductDetail;