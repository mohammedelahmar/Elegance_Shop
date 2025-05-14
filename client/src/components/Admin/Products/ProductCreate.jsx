import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Button as BsButton } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { createProduct } from '../../../api/product';
import { getAllCategories } from '../../../api/category';
import { FaPlus, FaTrash } from 'react-icons/fa';
import LoadingAnimation from '../../common/LoadingAnimation';

const ProductCreate = ({ show, onHide, onProductCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    images: [], // New array to store multiple images
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

  // Add new image input
  const addImageInput = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '', isMain: prev.images.length === 0 }]
    }));
  };

  // Remove image input
  const removeImageInput = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      
      // If we removed the main image, make the first one main
      if (newImages.length > 0 && newImages.every(img => !img.isMain)) {
        newImages[0].isMain = true;
      }
      
      return {
        ...prev,
        images: newImages
      };
    });
  };

  // Handle image input changes
  const handleImageChange = (index, field, value) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], [field]: value };
      
      // If marking this as main, unmark others
      if (field === 'isMain' && value === true) {
        newImages.forEach((img, i) => {
          if (i !== index) img.isMain = false;
        });
      }
      
      return {
        ...prev,
        images: newImages
      };
    });
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
      
      // If no images specified, use the image_url as the main image
      const dataToSubmit = { ...formData };
      if (formData.image_url && formData.images.length === 0) {
        dataToSubmit.images = [{ url: formData.image_url, alt: formData.name, isMain: true }];
      }

      await createProduct(dataToSubmit);
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
      images: [],
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
          
          {/* Legacy single image URL input */}
          <Input
            label="Primary Image URL"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            helperText="Enter the URL for the main product image"
          />
          
          {/* Multiple images section */}
          <div className="mb-3">
            <label className="form-label d-flex justify-content-between align-items-center">
              Additional Product Images
              <BsButton 
                variant="outline-primary" 
                size="sm" 
                onClick={addImageInput} 
                type="button"
              >
                <FaPlus /> Add Image
              </BsButton>
            </label>
            
            {formData.images.map((image, index) => (
              <Row key={index} className="mb-3 align-items-end">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={image.url}
                      onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Alt Text</Form.Label>
                    <Form.Control
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                      placeholder="Product description"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="Main Image"
                      checked={image.isMain}
                      onChange={(e) => handleImageChange(index, 'isMain', e.target.checked)}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex justify-content-end">
                  <BsButton 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => removeImageInput(index)}
                    type="button"
                  >
                    <FaTrash />
                  </BsButton>
                </Col>
              </Row>
            ))}
          </div>
          
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
            icon={loading ? null : FaPlus}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingAnimation size="small" /> Adding...
              </>
            ) : (
              'Add Product'
            )}
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