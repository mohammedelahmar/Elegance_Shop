import React, { useState } from 'react';
import { Table, Button, InputGroup, Form, Image, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { deleteProduct } from '../../../api/product';
import Message from '../../../components/UI/Message';
import PropTypes from 'prop-types';

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
      
      <div className="mb-3">
        <InputGroup>
          <InputGroup.Text id="search-addon">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search"
            aria-describedby="search-addon"
          />
        </InputGroup>
      </div>

      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
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
                  <td>{product._id.substring(product._id.length - 6).toUpperCase()}</td>
                  <td>
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.name} 
                        width="50" 
                        height="50"
                        className="object-fit-cover"
                      />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.category?.name || 'Uncategorized'}</td>
                  <td>
                    <Badge bg={product.stock_quantity > 0 ? 'success' : 'danger'}>
                      {product.stock_quantity > 0 ? product.stock_quantity : 'Out of Stock'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => onEditProduct(product)}
                        title="Edit Product"
                      >
                        <FaEdit />
                      </Button>
                      
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id, product.name)}
                        title="Delete Product"
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
        Showing {filteredProducts.length} of {products.length} products
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