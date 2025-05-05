import React, { useState } from 'react';
import { Table, Button, InputGroup, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { deleteCategory } from '../../../api/category';
import Message from '../../UI/Message';
import PropTypes from 'prop-types';
import './CategoryList.css';

const CategoryList = ({ categories, onEditCategory, onCategoryUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const filteredCategories = categories.filter(category => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete category "${categoryName}"?`)) {
      try {
        await deleteCategory(categoryId);
        setMessageType('success');
        setDeleteMessage(`Category "${categoryName}" has been deleted successfully`);
        setShowDeleteMessage(true);
        onCategoryUpdated();
      } catch (error) {
        setMessageType('danger');
        setDeleteMessage(`Error: ${error.response?.data?.message || error.message}`);
        setShowDeleteMessage(true);
      }
    }
  };

  return (
    <>
      {showDeleteMessage && (
        <Message 
          variant={messageType} 
          onClose={() => setShowDeleteMessage(false)} 
          dismissible
        >
          {deleteMessage}
        </Message>
      )}
      
      <div className="category-list-card" >
        <div className="category-search-bar mb-4">
          <InputGroup>
            <InputGroup.Text id="search-addon" className="category-search-icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search"
              aria-describedby="search-addon"
              className="category-search-input"
            />
          </InputGroup>
        </div>

        <div className="table-responsive">
          <Table hover className="category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredCategories.map(category => (
                  <tr key={category._id}>
                    <td>{category._id.substring(category._id.length - 6).toUpperCase()}</td>
                    <td>{category.name}</td>
                    <td>{category.description || '-'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => onEditCategory(category)}
                          title="Edit Category"
                        >
                          <FaEdit />
                        </Button>
                        
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteCategory(category._id, category.name)}
                          title="Delete Category"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
        <div className="mt-2 text-muted small">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>
    </>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
  onEditCategory: PropTypes.func.isRequired,
  onCategoryUpdated: PropTypes.func.isRequired
};

export default CategoryList;