import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Image, Spinner, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { updateProduct } from '../../../api/product';
import { getAllCategories } from '../../../api/category';
import { FaSave } from 'react-icons/fa';
import './ProductForms.css';

const ProductEdit = ({ product, show, onHide, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || 0,
        image_url: product.image_url || '',
        category: product.category?._id || product.category || ''
      });
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories. Please refresh and try again.');
      }
    };

    if (show) {
      fetchCategories();
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'stock_quantity' ? 
        parseFloat(value) || '' : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Validate price and stock values
      if (isNaN(formData.price) || formData.price <= 0) {
        setError('Price must be a positive number');
        setLoading(false);
        return;
      }

      if (isNaN(formData.stock_quantity) || formData.stock_quantity < 0) {
        setError('Stock quantity must be zero or a positive number');
        setLoading(false);
        return;
      }

      await updateProduct(product._id, formData);
      onProductUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
      size="lg"
      centered
      className="product-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit} className="product-form">
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {formData.image_url && (
            <div className="product-image-preview">
              <Image 
                src={formData.image_url} 
                alt={formData.name} 
                thumbnail
              />
            </div>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={3}
            />
          </Form.Group>
          
          <Row className="form-row">
            <Col md={6}>
              <Form.Group className="mb-3 mb-md-0">
                <Form.Label>Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="0"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <div className="helper-text">
              Enter the URL for the product image
            </div>
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Category</Form.Label> <br />
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" style={{ backgroundColor: '#29313e' }}>Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id} style={{ backgroundColor: '#29313e' }}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <button 
            type="button"
            className="btn product-form-btn btn-secondary"
            onClick={onHide}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="btn product-form-btn btn-primary"
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

ProductEdit.propTypes = {
  product: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onProductUpdated: PropTypes.func.isRequired
};

export default ProductEdit;