import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaPlus, FaSync } from 'react-icons/fa';
import { getAllCategories } from '../../api/category';
import CategoryList from '../../components/Admin/Categories/CategoryList';
import CategoryEdit from '../../components/Admin/Categories/CategoryEdit';
import CategoryAdd from '../../components/Admin/Categories/CategoryAdd';
import Loader from '../../components/UI/Loader';
import Message from '../../components/UI/Message';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getAllCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditCategory(null);
  };

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCategoryUpdated = () => {
    handleRefresh();
    handleCloseEditModal();
  };

  const handleCategoryAdded = () => {
    handleRefresh();
    handleCloseAddModal();
  };

  return (
    <div className="categories-admin-container">
      <div className="categories-admin-header">
        <h1 className="categories-admin-title">Category Management</h1>
        <div className="categories-admin-actions">
          <Button style={{ marginRight: "10px" }}
            variant="primary" 
            className="me-2" 
            onClick={handleShowAddModal}
          >
            <FaPlus /> Add Category
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={handleRefresh}
          >
            <FaSync /> Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="categories-admin-card">
          <Card.Body style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
            <CategoryList 
              categories={categories} 
              onEditCategory={handleEditCategory} 
              onCategoryUpdated={handleRefresh}
            />
          </Card.Body>
        </div>
      )}

      {showEditModal && (
        <CategoryEdit
          category={editCategory}
          show={showEditModal}
          onHide={handleCloseEditModal}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}

      <CategoryAdd
        show={showAddModal}
        onHide={handleCloseAddModal}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
};

export default CategoriesPage;