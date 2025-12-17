import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaPlus, FaSync } from 'react-icons/fa';
import { getAllProducts } from '../../api/product';
import ProductList from '../../components/Admin/Products/ProductList';
import ProductEdit from '../../components/Admin/Products/ProductEdit';
import ProductCreate from '../../components/Admin/Products/ProductCreate';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import Message from '../../components/UI/Message';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts({
          page: 1,
          limit: 50
        });
        setProducts(data.products);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditProduct(null);
  };

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleProductUpdated = () => {
    handleRefresh();
    handleCloseEditModal();
  };

  const handleProductCreated = () => {
    handleRefresh();
    handleCloseCreateModal();
  };

  return (
    <Container fluid className="products-admin-shell py-3">
      <Row className="mb-4 align-items-center products-hero">
        <Col>
          <p className="eyebrow">Admin • Products</p>
          <h1>Product Management</h1>
          <p className="subtitle">Oversee catalog, stock, and pricing in one place.</p>
        </Col>
        <Col xs="auto">
          <div className="products-admin-actions d-flex gap-2 flex-wrap justify-content-end">
            <Button
              variant="primary"
              className="me-2"
              onClick={handleShowCreateModal}
            >
              <FaPlus /> Add Product
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleRefresh}
            >
              <FaSync /> Refresh
            </Button>
          </div>
        </Col>
      </Row>

      {loading ? (
        <LoadingAnimation />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card className="products-card">
          <Card.Body>
            <ProductList
              products={products}
              onEditProduct={handleEditProduct}
              onProductUpdated={handleRefresh}
            />
          </Card.Body>
        </Card>
      )}

      {showEditModal && (
        <ProductEdit
          product={editProduct}
          show={showEditModal}
          onHide={handleCloseEditModal}
          onProductUpdated={handleProductUpdated}
        />
      )}

      <ProductCreate
        show={showCreateModal}
        onHide={handleCloseCreateModal}
        onProductCreated={handleProductCreated}
      />
    </Container>
  );
};

export default ProductsPage;