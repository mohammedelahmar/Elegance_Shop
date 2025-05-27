import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { FaPlus, FaSync } from 'react-icons/fa';
import { getVariantsByProduct } from '../../api/variant';
import { getAllProducts } from '../../api/product';
import VariantList from '../../components/Admin/Variants/VariantList';
import VariantEdit from '../../components/Admin/Variants/VariantEdit';
import VariantCreate from '../../components/Admin/Variants/VariantCreate';
import Loader from '../../components/UI/Loader';
import Message from '../../components/UI/Message';
import './VariantsPage.css'; // Import the new CSS file

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
  }, [selectedProduct]); // Added selectedProduct to dependency array

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
    <div className="variants-admin-container"> {/* Changed from Container fluid */} 
      <div className="variants-admin-header"> {/* Changed from Row */} 
        {/* <Col> - Removed */}
          <h1 className="variants-admin-title">Variant Management</h1> {/* Changed from h3 and added class */}
        {/* </Col> - Removed */}
        {/* <Col xs="auto"> - Removed */}
        <div className="variants-admin-actions"> {/* Added wrapper div for buttons */} 
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
        </div>
        {/* </Col> - Removed */} 
      </div>

      <Row className="mb-4"> {/* This Row can remain for layout of the select product dropdown */} 
        <Col md={6}>
          <Form.Group>
            <Form.Label /* style={{color:'white' , marginRight:'10px'}} - Style handled by CSS */ >Select Product</Form.Label>
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
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="variants-admin-card"> {/* Changed from Card */} 
          {/* <Card.Body> - Removed, padding handled by variants-admin-card */}
            {loadingVariants ? (
              <Loader />
            ) : (
              <VariantList 
                variants={variants} 
                product={products.find(p => p._id === selectedProduct)}
                onEditVariant={handleEditVariant} 
                onVariantUpdated={handleRefresh}
              />
            )}
          {/* </Card.Body> - Removed */} 
        </div>
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
    </div>
  );
};

export default VariantsPage;