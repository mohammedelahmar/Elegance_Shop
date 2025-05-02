import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { updateVariant } from '../../../api/variant';
import { FaSave } from 'react-icons/fa';

const VariantEdit = ({ variant, productId, show, onHide, onVariantUpdated }) => {
  const [formData, setFormData] = useState({
    taille: '',
    couleur: '',
    stock: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (variant) {
      setFormData({
        taille: variant.taille || '',
        couleur: variant.couleur || '',
        stock: variant.stock || 0
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
      
      // Validation
      if (formData.stock < 0) {
        setError('Stock quantity cannot be negative');
        setLoading(false);
        return;
      }

      await updateVariant(variant._id, {
        ...formData,
        product_id: productId
      });
      onVariantUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Variant</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Input
            label="Size"
            name="taille"
            value={formData.taille}
            onChange={handleChange}
            placeholder="e.g. S, M, L, XL"
          />
          
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
                  style={{
                    backgroundColor: formData.couleur,
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '1px solid #ddd'
                  }}
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
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            icon={FaSave}
            loading={loading}
          >
            Save Changes
          </Button>
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