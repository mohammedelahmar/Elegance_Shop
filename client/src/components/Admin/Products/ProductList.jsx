import React, { useState } from 'react';
import { Table, Button, InputGroup, Form, Image } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaTag, FaBoxes } from 'react-icons/fa';
import { deleteProduct } from '../../../api/product';
import Message from '../../../components/UI/Message';
import PropTypes from 'prop-types';
import './ProductList.css';

const ProductList = ({ products, onEditProduct, onProductUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      (product.description && product.description.toLowerCase().includes(term)) ||
      (product.category && product.category.name && product.category.name.toLowerCase().includes(term))
    );
  });

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete product "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        setMessageType('success');
        setDeleteMessage(`Product "${productName}" has been deleted successfully`);
        setShowDeleteMessage(true);
        onProductUpdated();
      } catch (error) {
        setMessageType('danger');
        setDeleteMessage(`Error: ${error.response?.data?.message || error.message}`);
        setShowDeleteMessage(true);
      }
    }
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    if (typeof price === 'object' && price.$numberDecimal) {
      return `$${parseFloat(price.$numberDecimal).toFixed(2)}`;
    }
    return `$${parseFloat(price).toFixed(2)}`;
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
      
      <div className="product-list-card">
        <div className="product-search-bar mb-4">
          <InputGroup>
            <InputGroup.Text id="search-addon" className="product-search-icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search"
              aria-describedby="search-addon"
              className="product-search-input"
            />
          </InputGroup>
          <div className="mt-2 text-muted small text-end">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        <div className="table-responsive">
          <Table hover className="product-table align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Pricing</th>
                <th>Category</th>
                <th>Stock</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-3">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-main">
                        <div className="product-thumb">
                          {product.image_url ? (
                            <Image 
                              src={product.image_url} 
                              alt={product.name} 
                              width="52" 
                              height="52"
                              className="object-fit-cover"
                              rounded
                            />
                          ) : (
                            <div className="placeholder-image">No Image</div>
                          )}
                        </div>
                        <div>
                          <div className="product-name">{product.name}</div>
                          <div className="product-id">#{product._id.substring(product._id.length - 6).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="price-chip">{formatPrice(product.price)}</div>
                    </td>
                    <td>
                      <div className="category-pill">
                        <FaTag /> {product.category?.name || 'Uncategorized'}
                      </div>
                    </td>
                    <td>
                      <div className={`stock-pill ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        <FaBoxes /> {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="action-buttons">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => onEditProduct(product)}
                          title="Edit Product"
                          className="action-button"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id, product.name)}
                          title="Delete Product"
                          className="action-button"
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
      </div>
    </>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onEditProduct: PropTypes.func.isRequired,
  onProductUpdated: PropTypes.func.isRequired
};

export default ProductList;