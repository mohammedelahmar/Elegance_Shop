import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { updateProduct } from '../../../api/product';
import { getAllCategories } from '../../../api/category';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const ProductEdit = ({ product, show, onHide, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    category: '',
    images: []
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
        category: product.category?._id || product.category || '',
        images: product.images || []
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

  const addImageInput = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '', isMain: prev.images.length === 0 }]
    }));
  };

  const removeImageInput = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((image, i) => 
        i === index ? { ...image, [field]: value } : image
      )
    }));
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          {formData.image_url && (
            <div className="text-center mb-3">
              <Image 
                src={formData.image_url} 
                alt={formData.name} 
                style={{ maxHeight: '200px' }}
                className="img-thumbnail"
              />
            </div>
          )}
          
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

          <div className="mt-3">
            <h5>Additional Images</h5>
            {formData.images.map((image, index) => (
              <Row key={index} className="align-items-center mb-2">
                <Col md={5}>
                  <Input
                    label="Image URL"
                    value={image.url}
                    onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                  />
                </Col>
                <Col md={5}>
                  <Input
                    label="Alt Text"
                    value={image.alt}
                    onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                  />
                </Col>
                <Col md={2} className="text-center">
                  <Button
                    variant="danger"
                    icon={FaTrash}
                    onClick={() => removeImageInput(index)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="success" icon={FaPlus} onClick={addImageInput}>
              Add Image
            </Button>
          </div>
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

ProductEdit.propTypes = {
  product: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onProductUpdated: PropTypes.func.isRequired
};

export default ProductEdit;