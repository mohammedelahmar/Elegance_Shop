import React, { useState, useEffect } from 'react';
import { Modal, Form, Alert, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { updateCategory } from '../../../api/category';
import { FaSave, FaEdit } from 'react-icons/fa';
import './CategoryForms.css';

const CategoryEdit = ({ category, show, onHide, onCategoryUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || ''
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      await updateCategory(category._id, formData);
      onCategoryUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
      className="category-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit} className="category-form">
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
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
              placeholder="Enter category description (optional)"
              rows={3}
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <button 
            type="button"
            className="btn category-form-btn btn-secondary"
            onClick={onHide}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="btn category-form-btn btn-primary"
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

CategoryEdit.propTypes = {
  category: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onCategoryUpdated: PropTypes.func.isRequired
};

export default CategoryEdit;