import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Alert, Spinner } from 'react-bootstrap'; // Added Alert and Spinner
import PropTypes from 'prop-types';
import { updateVariant } from '../../../api/variant';
import { FaSave } from 'react-icons/fa';
import { CLOTHING_SIZES, NUMERIC_SIZES, SHOE_SIZES } from '../../../constants/sizes';
import './VariantForms.css'; // Import the new CSS file

const VariantEdit = ({ variant, productId, show, onHide, onVariantUpdated }) => {
  const [formData, setFormData] = useState({
    taille: '',
    couleur: '',
    stock: 0,
    sizeType: 'clothing'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Determine size type based on the size value
  const determineSizeType = (size) => {
    if (CLOTHING_SIZES.some(s => s.value === size)) return 'clothing';
    if (NUMERIC_SIZES.some(s => s.value === size)) return 'numeric';
    if (SHOE_SIZES.some(s => s.value === size)) return 'shoe';
    return 'clothing';
  };

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

  useEffect(() => {
    if (variant) {
      setFormData({
        taille: variant.taille || '',
        couleur: variant.couleur || '',
        stock: variant.stock || 0,
        sizeType: determineSizeType(variant.taille)
      });
    }
  }, [variant]);

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
      
      if (formData.stock < 0) {
        setError('Stock quantity cannot be negative');
        setLoading(false);
        return;
      }
      // Ensure product_id is included, it might be missing if not explicitly set
      await updateVariant(variant._id, {
        ...formData,
        product_id: productId // Ensure productId is passed
      });
      onVariantUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      // setLoading(false); // setLoading(false) is in finally block
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      backdrop="static" 
      keyboard={false}
      centered
      className="variant-modal" // Apply the new modal class
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Variant</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit} className="variant-form"> {/* Apply the new form class */}
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>} {/* Use React Bootstrap Alert */}
          
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
          
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Color</Form.Label>
                <div className="color-preview-container"> {/* Wrapper for input and preview */}
                  <Form.Control
                    type="text"
                    name="couleur"
                    value={formData.couleur}
                    onChange={handleChange}
                    placeholder="e.g. Red, Blue, #FF0000"
                    className="color-input-group" /* Class for the input part */
                  />
                  {formData.couleur && (
                    <div
                      className="color-preview-modal" /* New class for modal color preview */
                      style={{ backgroundColor: formData.couleur }}
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
            className="btn variant-form-btn btn-secondary" // Apply new button classes
            onClick={onHide}
            disabled={loading} // Disable cancel if loading to prevent unintended state changes
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn variant-form-btn btn-primary" // Apply new button classes
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" /> Save Changes
              </>
            )}
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

VariantEdit.propTypes = {
  variant: PropTypes.object,
  productId: PropTypes.string,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onVariantUpdated: PropTypes.func.isRequired
};

export default VariantEdit;