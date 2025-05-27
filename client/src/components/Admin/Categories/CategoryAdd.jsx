import React, { useState } from 'react';
import { Modal, Form, Alert, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { createCategory } from '../../../api/category';
import { FaPlus } from 'react-icons/fa';
import './CategoryForms.css';

const CategoryAdd = ({ show, onHide, onCategoryAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      await createCategory(formData);
      resetForm();
      onCategoryAdded();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setLoading(false);
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
        <Modal.Title>Add New Category</Modal.Title>
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
            <div className="helper-text">
              Optional: Provide a brief description of the category
            </div>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <button 
            type="button"
            className="btn category-form-btn btn-secondary"
            onClick={() => {
              resetForm();
              onHide();
            }}
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
                Creating...
              </>
            ) : (
              <>
                <FaPlus className="me-2" /> Add Category
              </>
            )}
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

CategoryAdd.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onCategoryAdded: PropTypes.func.isRequired
};

export default CategoryAdd;