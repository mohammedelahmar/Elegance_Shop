import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Alert, Spinner } from 'react-bootstrap'; // Added Alert, Spinner
import PropTypes from 'prop-types';
// import Input from '../../UI/Input'; // To be replaced
// import Button from '../../UI/Button'; // To be replaced
import { createVariant } from '../../../api/variant';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { CLOTHING_SIZES, NUMERIC_SIZES, SHOE_SIZES, COMMON_COLORS } from '../../../constants/sizes';
import './VariantForms.css'; // Import the shared CSS file

const VariantCreate = ({ show, onHide, onVariantCreated, products, defaultProductId }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    taille: '',
    couleur: '',
    stock: 0,
    sizeType: 'clothing' // Default size type
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the appropriate size options based on the selected size type
  const getSizeOptions = () => {
    switch(formData.sizeType) {
      case 'numeric':
        return NUMERIC_SIZES;
      case 'shoe':
        return SHOE_SIZES;
      case 'clothing':
      default:
        return CLOTHING_SIZES;
    }
  };
  
  // Add this function inside your component
  const getColorStyle = (colorName) => {
    const colorEntry = COMMON_COLORS.find(c => 
      c.value.toLowerCase() === colorName.toLowerCase() || 
      c.label.toLowerCase() === colorName.toLowerCase()
    );
    return {
      backgroundColor: colorEntry ? colorEntry.hex : colorName,
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      border: '1px solid #ddd'
    };
  };

  useEffect(() => {
    if (show && defaultProductId) {
      setFormData(prev => ({
        ...prev,
        product_id: defaultProductId
      }));
    }
  }, [show, defaultProductId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'stock' ? parseInt(value, 10) || 0 : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      if (!formData.product_id) {
        setError('Please select a product');
        setLoading(false);
        return;
      }

      if (formData.stock < 0) {
        setError('Stock quantity cannot be negative');
        setLoading(false);
        return;
      }

      await createVariant(formData);
      // resetForm(); // Reset form is called before onHide in the cancel button, and after success before onVariantCreated
      onVariantCreated(); // Call this first
      resetForm(); // Then reset the form for the next time it opens
      // onHide(); // onHide is usually called by the parent after creation if modal needs to close
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      // setLoading(false); // setLoading is in the finally block
    } finally {
      setLoading(false); // Ensure loading is set to false in finally
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: defaultProductId || '',
      taille: '',
      couleur: '',
      stock: 0,
      sizeType: 'clothing'
    });
    setLoading(false);
  };

  return (
    <Modal 
      show={show} 
      onHide={() => { resetForm(); onHide(); }} // Ensure form resets on hide
      backdrop="static" 
      keyboard={false}
      centered
      className="variant-modal" // Apply shared modal class
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Variant</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit} className="variant-form"> {/* Apply shared form class */}
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>} {/* Use React Bootstrap Alert */}
          
          <Form.Group className="mb-3">
            <Form.Label>Product</Form.Label>
            <Form.Select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Size Type</Form.Label>
            <Form.Select
              name="sizeType"
              value={formData.sizeType}
              onChange={handleChange}
            >
              <option value="clothing">Clothing (XS, S, M, L, XL...)</option>
              <option value="numeric">Numeric (36, 38, 40...)</option>
              <option value="shoe">Shoe Sizes</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Size</Form.Label>
            <Form.Select
              name="taille"
              value={formData.taille}
              onChange={handleChange}
              required
            >
              <option value="">Select Size</option>
              {getSizeOptions().map(sizeOpt => (
                <option key={sizeOpt.value} value={sizeOpt.value}>{sizeOpt.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Common Colors</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-2"> {/* Reduced bottom margin for this div */}
              {COMMON_COLORS.map(color => (
                <div 
                  key={color.value}
                  onClick={() => setFormData(prev => ({ ...prev, couleur: color.value }))}
                  className={`color-preset ${formData.couleur === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                >
                  {formData.couleur === color.value && (
                    <FaCheck 
                      style={{ 
                        color: ['White', 'Yellow', 'Beige'].includes(color.label) ? '#000' : '#fff',
                        fontSize: '14px'
                      }} 
                    />
                  )}
                </div>
              ))}
            </div>
          </Form.Group>
          
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Color</Form.Label>
                <div className="color-preview-container">
                  <Form.Control
                    type="text"
                    name="couleur"
                    value={formData.couleur}
                    onChange={handleChange}
                    placeholder="e.g. Red, Blue, #FF0000"
                    className="color-input-group"
                  />
                  {formData.couleur && (
                    <div
                      className="color-preview-modal"
                      style={getColorStyle(formData.couleur)} // Use existing getColorStyle
                      title={formData.couleur}
                    ></div>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <button 
            type="button"
            className="btn variant-form-btn btn-secondary"
            onClick={() => {
              resetForm();
              onHide();
            }}
            disabled={loading} // Disable if loading
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn variant-form-btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Adding...
              </>
            ) : (
              <>
                <FaPlus className="me-2" /> Add Variant
              </>
            )}
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

VariantCreate.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onVariantCreated: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  defaultProductId: PropTypes.string
};

export default VariantCreate;