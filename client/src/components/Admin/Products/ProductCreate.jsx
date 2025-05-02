import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { createProduct } from '../../../api/product';
import { getAllCategories } from '../../../api/category';
import { FaPlus } from 'react-icons/fa';

const ProductCreate = ({ show, onHide, onProductCreated }) => {
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

      await createProduct(formData);
      resetForm();
      onProductCreated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      image_url: '',
      category: ''
    });
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            as="textarea"
            rows={3}
            helperText="Provide a detailed description of the product"
          />
          
          <Row>
            <Col md={6}>
              <Input
                label="Price ($)"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </Col>
            <Col md={6}>
              <Input
                label="Stock Quantity"
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </Col>
          </Row>
          
          <Input
            label="Image URL"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            helperText="Enter the URL for the product image"
          />
          
          <Input
            label="Category"
            as="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Select Category' },
              ...categories.map(category => ({
                value: category._id,
                label: category.name
              }))
            ]}
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
            Add Product
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

ProductCreate.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onProductCreated: PropTypes.func.isRequired
};

export default ProductCreate;