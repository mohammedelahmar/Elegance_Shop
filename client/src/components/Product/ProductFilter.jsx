import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaTimes } from 'react-icons/fa';
import Input from '../UI/Input';
import Button from '../UI/Button';
import PropTypes from 'prop-types';

const ProductFilter = ({ filters, categories, onFilterChange, onClearFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange(name, type === 'checkbox' ? checked : value);
  };

  const toggleSortOrder = () => {
    onFilterChange('order', filters.order === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="filter-panel p-3">
      <h5><FaFilter className="me-2" /> Filter Products</h5>
      
      <Form>
        <Row>
          <Col md={4}>
            <Input
              label="Search"
              type="text"
              placeholder="Search products..."
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              icon={FaSearch}
            />
          </Col>
          
          <Col md={4}>
            <Input
              label="Category"
              as="select"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              options={[
                { value: '', label: 'All Categories' },
                ...(categories || []).map(category => ({
                  value: category._id,
                  label: category.name
                }))
              ]}
            />
          </Col>
          
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Sort By</Form.Label>
              <div className="d-flex">
                <Input
                  as="select"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="me-2"
                  options={[
                    { value: 'createdAt', label: 'Newest First' },
                    { value: 'price', label: 'Price' },
                    { value: 'name', label: 'Name' }
                  ]}
                />
                <Button 
                  variant="outline-secondary"
                  onClick={toggleSortOrder}
                  icon={filters.order === 'asc' ? FaSortAmountUp : FaSortAmountDown}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={4}>
            <Form.Label>Price Range</Form.Label>
            <Row>
              <Col>
                <Input
                  type="number"
                  placeholder="Min"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="mb-3"
                />
              </Col>
              <Col>
                <Input
                  type="number"
                  placeholder="Max"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="mb-3"
                />
              </Col>
            </Row>
          </Col>
          
          <Col md={4} className="d-flex align-items-end">
            <Form.Group className="mb-3 w-100">
              <Form.Check
                type="checkbox"
                label="In Stock Only"
                name="inStock"
                checked={filters.inStock}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          
          <Col md={4} className="d-flex align-items-end justify-content-end">
            <Button 
              variant="secondary" 
              className="mb-3" 
              onClick={onClearFilters}
              icon={FaTimes}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

ProductFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired
};

export default ProductFilter;