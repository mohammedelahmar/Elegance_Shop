import React, { useState } from 'react';
import { Table, Button, InputGroup, Form, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { deleteVariant } from '../../../api/variant';
import Message from '../../UI/Message';
import PropTypes from 'prop-types';
import './VariantList.css';

const VariantList = ({ variants, product, onEditVariant, onVariantUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const filteredVariants = variants.filter(variant => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase().trim();
    const taille = variant.taille ? variant.taille.toLowerCase() : '';
    const couleur = variant.couleur ? variant.couleur.toLowerCase() : '';
    
    return taille.includes(term) || couleur.includes(term);
  });

  const handleDeleteVariant = async (variantId, variantName) => {
    if (window.confirm(`Are you sure you want to delete this variant?`)) {
      try {
        await deleteVariant(variantId);
        setMessageType('success');
        setDeleteMessage(`Variant has been deleted successfully`);
        setShowDeleteMessage(true);
        onVariantUpdated();
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
      
      <div className="mb-3">
        <InputGroup>
          <InputGroup.Text id="search-addon">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search variants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search"
            aria-describedby="search-addon"
          />
        </InputGroup>
      </div>

      {product && (
        <div className="mb-4">
          <h4>Variants for: {product.name}</h4>
        </div>
      )}

      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Size</th>
              <th>Color</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVariants.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  {product ? `No variants found for this product` : 'Select a product to view variants'}
                </td>
              </tr>
            ) : (
              filteredVariants.map(variant => (
                <tr key={variant._id}>
                  <td>{variant._id.substring(variant._id.length - 6).toUpperCase()}</td>
                  <td>
                    <span className="size-badge">
                      {variant.taille || '-'}
                    </span>
                  </td>
                  <td>
                    {variant.couleur ? (
                      <div className="d-flex align-items-center">
                        <div
                          className="color-preview me-2"
                          style={{
                            backgroundColor: variant.couleur,
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: '1px solid #ddd'
                          }}
                        ></div>
                        {variant.couleur}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <Badge bg={variant.stock > 0 ? (variant.stock <= 5 ? 'warning' : 'success') : 'danger'}>
                      {variant.stock > 0 ? 
                        `${variant.stock} in stock` : 
                        'Out of stock'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => onEditVariant(variant)}
                        title="Edit Variant"
                      >
                        <FaEdit />
                      </Button>
                      
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteVariant(variant._id, `${variant.taille} ${variant.couleur}`)}
                        title="Delete Variant"
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
        Showing {filteredVariants.length} of {variants.length} variants
      </div>
    </>
  );
};

VariantList.propTypes = {
  variants: PropTypes.array.isRequired,
  product: PropTypes.object,
  onEditVariant: PropTypes.func.isRequired,
  onVariantUpdated: PropTypes.func.isRequired
};

export default VariantList;