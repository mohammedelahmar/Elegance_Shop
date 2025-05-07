import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import PropTypes from 'prop-types';

const LowStockAlert = ({ variants, threshold = 5 }) => {
  // Filter variants with low stock
  const lowStockVariants = variants.filter(variant => 
    variant.stock > 0 && variant.stock <= threshold
  );
  
  if (!lowStockVariants.length) {
    return (
      <Card className="mb-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0 d-flex align-items-center">
            <FaExclamationTriangle className="me-2 text-success" />
            Stock Status
          </h5>
        </Card.Header>
        <Card.Body className="text-center py-4">
          <p className="mb-0 text-success">All products are well-stocked</p>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="mb-4">
      <Card.Header className="bg-warning text-dark">
        <h5 className="mb-0 d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          Low Stock Alert
        </h5>
      </Card.Header>
      <Card.Body>
        <p>The following variants are running low on stock:</p>
        <Table responsive size="sm">
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lowStockVariants.map(variant => (
              <tr key={variant._id}>
                <td>
                  <Link to={`/admin/products/${variant.product_id._id}`}>
                    {variant.product_id.name}
                  </Link>
                </td>
                <td>
                  {variant.taille} / {variant.couleur}
                </td>
                <td>
                  <Badge bg="warning" text="dark">
                    {variant.stock} left
                  </Badge>
                </td>
                <td>
                  <Link to={`/admin/variants?product=${variant.product_id._id}`}>
                    Update Stock
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

LowStockAlert.propTypes = {
  variants: PropTypes.array.isRequired,
  threshold: PropTypes.number
};

export default LowStockAlert;