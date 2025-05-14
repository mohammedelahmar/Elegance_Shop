import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FaPlus, FaSync } from 'react-icons/fa';
import { getVariantsByProduct } from '../../api/variant';
import { getAllProducts } from '../../api/product';
import VariantList from '../../components/Admin/Variants/VariantList';
import VariantEdit from '../../components/Admin/Variants/VariantEdit';
import VariantCreate from '../../components/Admin/Variants/VariantCreate';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import Message from '../../components/UI/Message';

const VariantsPage = () => {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editVariant, setEditVariant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loadingVariants, setLoadingVariants] = useState(false);

  // Fetch all products for the dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts({ limit: 100 }); // Get more products for admin view
        setProducts(data.products || []);
        if (data.products && data.products.length > 0 && !selectedProduct) {
          setSelectedProduct(data.products[0]._id);
        }
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  // Fetch variants when product selection changes
  useEffect(() => {
    const fetchVariants = async () => {
      if (!selectedProduct) return;
      
      try {
        setLoadingVariants(true);
        const data = await getVariantsByProduct(selectedProduct);
        setVariants(data.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load variants');
      } finally {
        setLoadingVariants(false);
        setLoading(false);
      }
    };

    fetchVariants();
  }, [selectedProduct, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditVariant = (variant) => {
    setEditVariant(variant);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditVariant(null);
  };

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleVariantUpdated = () => {
    handleRefresh();
    handleCloseEditModal();
  };

  const handleVariantCreated = () => {
    handleRefresh();
    handleCloseCreateModal();
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    setVariants([]);
  };

  return (
    <Container fluid className="py-3">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="h3 mb-0">Variant Management</h1>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            className="me-2" 
            onClick={handleShowCreateModal}
          >
            <FaPlus /> Add Variant
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={handleRefresh}
          >
            <FaSync /> Refresh
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select Product</Form.Label>
            <Form.Select 
              value={selectedProduct} 
              onChange={handleProductChange}
              disabled={products.length === 0}
            >
              {products.length === 0 && (
                <option value="">No products available</option>
              )}
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <LoadingAnimation size="large" text="Loading products..." />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card>
          <Card.Body>
            {loadingVariants ? (
              <div className="text-center my-3">
                <LoadingAnimation size="medium" text="Loading variants..." />
              </div>
            ) : (
              <VariantList 
                variants={variants} 
                product={products.find(p => p._id === selectedProduct)}
                onEditVariant={handleEditVariant} 
                onVariantUpdated={handleRefresh}
              />
            )}
          </Card.Body>
        </Card>
      )}

      {showEditModal && (
        <VariantEdit
          variant={editVariant}
          productId={selectedProduct}
          show={showEditModal}
          onHide={handleCloseEditModal}
          onVariantUpdated={handleVariantUpdated}
        />
      )}

      <VariantCreate
        show={showCreateModal}
        onHide={handleCloseCreateModal}
        onVariantCreated={handleVariantCreated}
        products={products}
        defaultProductId={selectedProduct}
      />
    </Container>
  );
};

export default VariantsPage;