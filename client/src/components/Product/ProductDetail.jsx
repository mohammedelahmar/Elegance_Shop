import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Badge, Form, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/action';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaPlus, FaMinus, FaCheck } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import WishlistButton from '../wishlist/WishlistButton';
import SizeGuide from './SizeGuide';
import useRecentlyViewed from '../../hooks/useRecentlyViewed';
import ProductImageGallery from './ProductImageGallery';
import LoadingAnimation from '../common/LoadingAnimation';
import './ProductDetail.css';

// Existing helper functions remain the same
const formatPrice = (price) => {
  if (!price) return '0.00';
  
  if (typeof price === 'object' && price.$numberDecimal) {
    return parseFloat(price.$numberDecimal).toFixed(2);
  }
  
  return parseFloat(price).toFixed(2);
};

const getColorHex = (colorName) => {
  const COMMON_COLORS = [
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'white', label: 'White', hex: '#ffffff' },
    { value: 'red', label: 'Red', hex: '#ff0000' },
    { value: 'blue', label: 'Blue', hex: '#0000ff' },
    { value: 'green', label: 'Green', hex: '#008000' },
    { value: 'yellow', label: 'Yellow', hex: '#ffff00' },
    { value: 'purple', label: 'Purple', hex: '#800080' },
    { value: 'orange', label: 'Orange', hex: '#ffa500' },
    { value: 'gold', label: 'Gold', hex: '#ffd700' },
    { value: 'silver', label: 'Silver', hex: '#c0c0c0' },
    { value: 'navy', label: 'Navy', hex: '#000080' },
    { value: 'royal blue', label: 'Royal Blue', hex: '#4169e1' },
    { value: 'teal', label: 'Teal', hex: '#008080' },
    { value: 'grey', label: 'Grey', hex: '#808080' },
    { value: 'pink', label: 'Pink', hex: '#ffc0cb' },
    { value: 'brown', label: 'Brown', hex: '#a52a2a' },
    { value: 'maroon', label: 'Maroon', hex: '#800000' },
    { value: 'olive', label: 'Olive', hex: '#808000' },
  ];
  
  const colorEntry = COMMON_COLORS.find(c => 
    c.value.toLowerCase() === colorName.toLowerCase() || 
    c.label.toLowerCase() === colorName.toLowerCase()
  );
  return colorEntry ? colorEntry.hex : colorName;
};

// Updated component with hideMainInfo prop
const ProductDetail = ({ product, variants, onAddToCart, hideMainInfo }) => {
  const dispatch = useDispatch();
  const cart = useCart();
  const addItem = cart?.addItem || (async () => console.log('Cart context not available'));
  const navigate = useNavigate();
  const { addProduct } = useRecentlyViewed();
  
  // States remain the same
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeType, setSizeType] = useState('clothing');
  const [cartMessage, setCartMessage] = useState({ show: false, type: '', text: '' });
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Rest of your hooks and handlers remain the same
  // ...

  const getVariantStatus = (variant) => {
    if (!variant) return null;
    
    if (variant.stock <= 0) {
      return { status: 'danger', text: 'Out of Stock' };
    } else if (variant.stock <= 5) {
      return { status: 'warning', text: `Only ${variant.stock} left!` };
    } else {
      return { status: 'success', text: 'In Stock' };
    }
  };

  // Keep all your existing useEffects and handlers
  useEffect(() => {
    if (variants && variants.length > 0) {
      const uniqueSizes = [...new Set(variants.map(v => v.taille))];
      const uniqueColors = [...new Set(variants.map(v => v.couleur))];
      
      const sizeOptions = uniqueSizes.map(size => {
        const sizeVariants = variants.filter(v => v.taille === size);
        const isInStock = sizeVariants.some(v => v.stock > 0);
        
        return {
          value: size,
          label: size,
          inStock: isInStock
        };
      });
      
      const colorOptions = uniqueColors.map(color => {
        const colorVariants = variants.filter(v => v.couleur === color);
        const isInStock = colorVariants.some(v => v.stock > 0);
        
        return {
          value: color,
          label: color,
          inStock: isInStock
        };
      });
      
      setAvailableSizes(sizeOptions);
      setAvailableColors(colorOptions);
    }
  }, [variants]);

  useEffect(() => {
    if (selectedSize && variants && variants.length > 0) {
      const filteredColors = variants
        .filter(v => v.taille === selectedSize)
        .map(v => ({
          value: v.couleur,
          label: v.couleur,
          inStock: v.stock > 0
        }));
      
      const uniqueColors = filteredColors.filter(
        (color, index, self) => index === self.findIndex(c => c.value === color.value)
      );
      
      setAvailableColors(uniqueColors);
      
      if (selectedColor && !uniqueColors.some(c => c.value === selectedColor)) {
        setSelectedColor('');
        setSelectedVariant(null);
      }
    }
  }, [selectedSize, variants, selectedColor]);

  useEffect(() => {
    if (selectedSize && selectedColor && variants) {
      const matchingVariant = variants.find(
        v => v.taille === selectedSize && v.couleur === selectedColor
      );
      
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
        
        if (matchingVariant.stock > 0) {
          setQuantity(prev => Math.min(prev, matchingVariant.stock));
        } else {
          setQuantity(1);
        }
      } else {
        setSelectedVariant(null);
      }
    } else {
      setSelectedVariant(null);
    }
  }, [selectedSize, selectedColor, variants]);

  useEffect(() => {
    if (selectedVariant && selectedVariant.taille) {
      if (['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].includes(selectedVariant.taille)) {
        setSizeType('clothing');
      } else if (['36', '38', '40', '42', '44', '46'].includes(selectedVariant.taille)) {
        setSizeType('numeric');
      } else if (['38', '39', '40', '41', '42', '43', '44', '45'].includes(selectedVariant.taille)) {
        setSizeType('shoe');
      }
    }
  }, [selectedVariant]);

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      // Add product to recently viewed
      addProduct({
        _id: product._id,
        name: product.name,
        price: product.price,
        image_url: product.image_url
      });
    }
  }, [product, addProduct]);

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
    setSelectedColor('');
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) setQuantity(1);
    else if (value > availableStock) setQuantity(availableStock);
    else setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!selectedVariant && variants && variants.length > 0) {
      setCartMessage({
        show: true,
        type: 'danger',
        text: 'Please select size and color before adding to cart.'
      });
      return;
    }
    
    setAdding(true);
    setIsAddingToCart(true); // Start showing animation
    
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
      
      setCartMessage({
        show: true,
        type: 'success',
        text: 'Item added to your cart!'
      });
      
      if (!selectedVariant) {
        setQuantity(1);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setCartMessage({
        show: true,
        type: 'danger',
        text: 'Failed to add item to cart. Please try again.'
      });
    } finally {
      setAdding(false);
      setIsAddingToCart(false); // Stop showing animation
    }
  };

  const availableStock = selectedVariant 
    ? (selectedVariant.stock || 0) 
    : (product?.stock_quantity || 0);

  const isOutOfStock = availableStock <= 0;
  
  // Updated return with conditional rendering based on hideMainInfo prop
  return (
    <div className={`product-detail-container ${hideMainInfo ? 'integrated-product-detail' : ''}`}>
      <div className={`product-showcase-card ${hideMainInfo ? 'no-padding' : ''}`}>
        <Row>
          {/* Only show the image column if not hiding main info */}
          {!hideMainInfo && (
            <Col md={5} className="mb-4">
              <ProductImageGallery product={product} />
            </Col>
          )}
          
          <Col md={hideMainInfo ? 12 : 7}>
            <div className="product-info-container">
              {/* Only show header info if not hiding main info */}
              {!hideMainInfo && (
                <>
                  <div className="product-header">
                    <h2 className="product-title">{product.name}</h2>
                    <WishlistButton productId={product._id} className="wishlist-button" />
                  </div>
                  
                  <div className="product-rating">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} className="rating-star">★</span>
                    ))}
                    <span className="review-count">5.0 (2 reviews)</span>
                  </div>
                  
                  <div className="price-section">
                    <span className="product-price">
                      ${selectedVariant ? formatPrice(selectedVariant.price || product.price) : formatPrice(product.price)}
                    </span>
                    {!selectedVariant && variants?.length > 0 && 
                      <span className="select-options-badge">Select options</span>
                    }
                  </div>
                  
                  <div className="product-description">
                    <p>{product.description || 'A nice black hoodie'}</p>
                  </div>
                </>
              )}
              
              {/* Always show alert messages */}
              {cartMessage.show && (
                <Alert 
                  variant={cartMessage.type} 
                  dismissible 
                  onClose={() => setCartMessage({ show: false, type: '', text: '' })}
                  className="mb-3 cart-alert"
                >
                  {cartMessage.text}
                  {cartMessage.type === 'success' && (
                    <div className="mt-2">
                      <button 
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => navigate('/cart')}
                      >
                        View Cart
                      </button>
                      <button 
                        className="btn btn-link btn-sm"
                        onClick={() => setCartMessage({ show: false, type: '', text: '' })}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}
                </Alert>
              )}
              
              {/* Add this wrapper div */}
              <div className="product-controls-container">
                {variants && variants.length > 0 && (
                  <>
                    <div className="size-section">
                      <div className="option-header">
                        <span className="option-title">Size</span>
                        <button 
                          className="size-guide-link"
                          onClick={() => setShowSizeGuide(true)}
                          type="button"
                        >
                          Size Guide
                        </button>
                      </div>
                      <select 
                        className="form-control"
                        value={selectedSize}
                        onChange={handleSizeChange}
                      >
                        <option value="">Select Size</option>
                        {availableSizes.map(size => (
                          <option 
                            key={size.value} 
                            value={size.value}
                            disabled={!size.inStock}
                          >
                            {size.label} {!size.inStock ? '(Out of Stock)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="color-section">
                      <div className="option-header">
                        <span className="option-title">Color</span>
                      </div>
                      
                      {selectedSize ? (
                        <div className="color-options">
                          {availableColors.map(color => (
                            <div 
                              key={color.value}
                              onClick={() => color.inStock && handleColorChange(color.value)}
                              className={`color-option ${selectedColor === color.value ? 'selected' : ''} ${!color.inStock ? 'out-of-stock' : ''}`}
                              style={{ 
                                backgroundColor: getColorHex(color.value),
                                cursor: color.inStock ? 'pointer' : 'not-allowed'
                              }}
                              title={color.label}
                            >
                              {selectedColor === color.value && (
                                <FaCheck className="check-icon" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="color-help-text">Please select a size first to see available colors</div>
                      )}
                    </div>
                  </>
                )}
                
                <div className="quantity-section">
                  <div className="option-header">
                    <span className="option-title">Quantity</span>
                  </div>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={isOutOfStock}
                      type="button"
                    >
                      <FaMinus size={12} />
                    </button>
                    <input
                      type="text"
                      className="quantity-input"
                      value={quantity}
                      onChange={handleQuantityChange}
                      disabled={isOutOfStock}
                      readOnly
                    />
                    <button 
                      className="quantity-btn"
                      onClick={() => setQuantity(prev => Math.min(availableStock, prev + 1))}
                      disabled={isOutOfStock}
                      type="button"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
                
                <button 
                  className="add-to-cart-main-btn"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || (variants && variants.length > 0 && !selectedVariant)}
                  type="button"
                >
                  <FaShoppingCart className="add-to-cart-icon me-2" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
              
              {/* Rest of your content */}
              {/* Only show meta info if not hiding main info */}
              {!hideMainInfo && (
                <div className="product-meta-info">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{product.category?.name || 'Hoodies'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Availability:</span>
                    <span className="meta-value">{isOutOfStock ? 'Out of Stock' : 'In Stock'}</span>
                  </div>
                  {selectedVariant && (
                    <div className="meta-item">
                      <span className="meta-label">Selected:</span>
                      <span className="meta-value">
                        {selectedVariant.taille} {selectedVariant.couleur}
                        {selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                          <Badge bg="warning" text="dark" className="ms-2" style={{fontSize: '10px', padding: '2px 4px'}}>
                            Only {selectedVariant.stock} left!
                          </Badge>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
      
      {isAddingToCart && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
             style={{backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 1050}}>
          <LoadingAnimation size="large" text="Adding to cart..." />
        </div>
      )}
      
      <SizeGuide 
        show={showSizeGuide} 
        onHide={() => setShowSizeGuide(false)} 
        sizeType={sizeType}
      />
    </div>
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