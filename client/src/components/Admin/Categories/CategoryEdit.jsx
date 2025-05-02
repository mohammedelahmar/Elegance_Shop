import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import { updateCategory } from '../../../api/category';
import { FaSave } from 'react-icons/fa';

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
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

CategoryEdit.propTypes = {
  category: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onCategoryUpdated: PropTypes.func.isRequired
};

export default CategoryEdit;