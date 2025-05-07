import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { createVariant } from '../../../api/variant';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { CLOTHING_SIZES, NUMERIC_SIZES, SHOE_SIZES, COMMON_COLORS } from '../../../constants/sizes';

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
      
      // Validation
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
      resetForm();
      onVariantCreated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
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
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Variant</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Input
            label="Product"
            as="select"
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Select Product' },
              ...products.map(product => ({
                value: product._id,
                label: product.name
              }))
            ]}
          />
          
          {/* Size Type Selection */}
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
          
          {/* Size Selection */}
          <Input
            label="Size"
            as="select"
            name="taille"
            value={formData.taille}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Select Size' },
              ...getSizeOptions()
            ]}
          />
          
          <Form.Label>Common Colors</Form.Label>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {COMMON_COLORS.map(color => (
              <div 
                key={color.value}
                onClick={() => setFormData(prev => ({ ...prev, couleur: color.value }))}
                className={`color-preset ${formData.couleur === color.value ? 'selected' : ''}`}
                style={{ 
                  backgroundColor: color.hex,
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}
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
          
          <Row>
            <Col>
              <Input
                label="Color"
                name="couleur"
                value={formData.couleur}
                onChange={handleChange}
                placeholder="e.g. Red, Blue, etc."
              />
            </Col>
            <Col xs={2} className="d-flex align-items-end mb-3">
              {formData.couleur && (
                <div
                  className="color-preview"
                  style={getColorStyle(formData.couleur)}
                  title={formData.couleur}
                ></div>
              )}
            </Col>
          </Row>
          
          <Input
            label="Stock"
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              resetForm();
              onHide();
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            icon={FaPlus}
            loading={loading}
          >
            Add Variant
          </Button>
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