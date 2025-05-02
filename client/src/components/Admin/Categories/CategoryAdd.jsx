import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { createCategory } from '../../../api/category';
import { FaPlus } from 'react-icons/fa';

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
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Category</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Input
            label="Category Name"
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
            helperText="Optional: Provide a brief description of the category"
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
            Add Category
          </Button>
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