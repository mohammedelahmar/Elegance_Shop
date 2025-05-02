import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { createVariant } from '../../../api/variant';
import { FaPlus } from 'react-icons/fa';

const VariantCreate = ({ show, onHide, onVariantCreated, products, defaultProductId }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    taille: '',
    couleur: '',
    stock: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      stock: 0
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