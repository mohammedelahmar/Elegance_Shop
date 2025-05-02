import React from 'react';
import { Table, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const TopProducts = ({ products }) => {
  if (!products.length) {
    return <p className="text-muted text-center">No product data available</p>;
  }
  
  return (
    <Table responsive className="align-middle">
      <thead className="table-light">
        <tr>
          <th>Product</th>
          <th className="text-center">Units Sold</th>
          <th className="text-end">Revenue</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>
              <div className="d-flex align-items-center">
                {product.image ? (
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    width={40} 
                    height={40} 
                    className="me-2 object-fit-cover rounded"
                  />
                ) : (
                  <div 
                    className="bg-light rounded me-2" 
                    style={{ width: 40, height: 40 }}
                  />
                )}
                <Link 
                  to={`/admin/products/${product.id}`}
                  className="text-decoration-none"
                >
                  {product.name}
                </Link>
              </div>
            </td>
            <td className="text-center">{product.quantity}</td>
            <td className="text-end">${product.revenue.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

TopProducts.propTypes = {
  products: PropTypes.array.isRequired
};

export default TopProducts;