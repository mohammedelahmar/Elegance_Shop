import React, { useState } from 'react';
import { Badge, Collapse } from 'react-bootstrap';
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaTimes, FaChevronDown, FaChevronUp, FaBars } from 'react-icons/fa';
import Input from '../UI/Input';
import Button from '../UI/Button';
import PropTypes from 'prop-types';
import './ProductFilter.css';

// Filter Section Component for collapsible sections
const FilterSection = ({ title, children, defaultOpen = false }) => { // Changed defaultOpen to false
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="filter-section">
      <div 
        className="filter-section-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="filter-title">{title}</span>
        <span className="filter-icon">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>
      <Collapse in={isOpen}>
        <div className="filter-section-content">
          {children}
        </div>
      </Collapse>
    </div>
  );
};

const ProductFilter = ({ filters, categories, onFilterChange, onClearFilters }) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange(name, type === 'checkbox' ? checked : value);
  };

  const toggleSortOrder = () => {
    onFilterChange('order', filters.order === 'asc' ? 'desc' : 'asc');
  };
  
  // Generate active filter tags
  const getActiveFilters = () => {
    const active = [];
    
    if (filters.keyword) active.push({ name: 'keyword', label: `Search: ${filters.keyword}` });
    if (filters.category) {
      const category = categories.find(c => c._id === filters.category);
      if (category) active.push({ name: 'category', label: category.name });
    }
    if (filters.minPrice) active.push({ name: 'minPrice', label: `Min: $${filters.minPrice}` });
    if (filters.maxPrice) active.push({ name: 'maxPrice', label: `Max: $${filters.maxPrice}` });
    if (filters.inStock) active.push({ name: 'inStock', label: 'In Stock' });
    
    return active;
  };
  
  const activeFilters = getActiveFilters();

  return (
    <div className="product-filter-container">
      {/* Filter Button to show the sidebar */}
      <div className="filter-btn-container">
        <Button 
          variant="dark" 
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="filter-toggle-btn"
        >
          <FaBars className="me-2" /> Filters
        </Button>
      </div>

      {/* Sidebar overlay that appears when sidebar is open */}
      {showMobileFilter && (
        <div 
          className="filter-overlay"
          onClick={() => setShowMobileFilter(false)}
        ></div>
      )}

      {/* Slide-in Sidebar Filter */}
      <div className={`filter-sidebar ${showMobileFilter ? 'active' : ''}`}>
        <div className="filter-sidebar-header">
          <h5><FaFilter className="me-2" /> Filters</h5>
          <Button 
            variant="link" 
            onClick={() => setShowMobileFilter(false)}
            className="filter-close-btn"
          >
            <FaTimes />
          </Button>
        </div>

        <div className="filter-sidebar-content">
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="active-filters-container">
              <div className="d-flex justify-content-between">
                <span className="active-filters-label">Active Filters</span>
                <Button 
                  variant="link" 
                  onClick={onClearFilters}
                  className="clear-all-btn"
                >
                  Clear All
                </Button>
              </div>
              <div className="active-filters-list">
                {activeFilters.map((filter, index) => (
                  <Badge 
                    key={index} 
                    className="active-filter-badge"
                  >
                    {filter.label}
                    <FaTimes 
                      className="remove-filter-icon"
                      onClick={() => onFilterChange(filter.name, filter.name === 'inStock' ? false : '')} 
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Section */}
          <FilterSection title="Search Products">
            <div className="search-box simple-search">
              <input
                type="text"
                placeholder="Search products..."
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                className="simple-search-input"
                autoComplete="off"
              />
            </div>
          </FilterSection>
          
          {/* Category Section */}
          <FilterSection title="Categories">
            <ul className="categories-list">
              <li 
                className={`category-item ${filters.category === '' ? 'selected' : ''}`}
                onClick={() => onFilterChange('category', '')}
              >
                All Categories
              </li>
              {categories.map(category => (
                <li 
                  key={category._id} 
                  className={`category-item ${filters.category === category._id ? 'selected' : ''}`}
                  onClick={() => onFilterChange('category', category._id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </FilterSection>
          
          {/* Price Range Section */}
          <FilterSection title="Price Range">
            <div className="price-range-container simple-price-range">
              <input
                type="number"
                placeholder="Min"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="simple-price-input"
                min="0"
              />
              <span className="price-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="simple-price-input"
                min="0"
              />
            </div>
          </FilterSection>
          
          {/* Availability Section */}
          <FilterSection title="Availability">
            <div className="availability-option">
              <label className="custom-stock-checkbox">
                <input
                  type="checkbox"
                  id="in-stock-checkbox"
                  name="inStock"
                  checked={filters.inStock}
                  onChange={handleFilterChange}
                />
                <span className="checkmark"></span>
                In Stock Only
              </label>
            </div>
          </FilterSection>
          
          {/* Sorting Section */}
          <FilterSection title="Sort By">
            <div className="sort-controls">
              <div className="select-container">
                <Input
                  as="select"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  options={[
                    { value: 'createdAt', label: 'Newest' },
                    { value: 'price', label: 'Price' },
                    { value: 'name', label: 'Name' }
                  ]}
                />
              </div>
              <Button 
                variant="outline-secondary"
                onClick={toggleSortOrder}
                className="sort-direction-btn"
              >
                {filters.order === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </Button>
            </div>
          </FilterSection>
        </div>
      </div>
    </div>
  );
};

FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool
};

ProductFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired
};

export default ProductFilter;

