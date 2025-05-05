import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import Pagination from './Pagination';
import { getAllProducts } from '../../api/product';
import { getAllCategories } from '../../api/category';
import './ProductList.css';
import PropTypes from 'prop-types';

const ProductList = ({ isAdmin = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') === 'true',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    order: searchParams.get('order') || 'desc',
    page: parseInt(searchParams.get('page')) || 1
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    totalProducts: 0,
    hasMore: false
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          page: filters.page,
          limit: 12,
          keyword: filters.keyword || undefined,
          category: filters.category || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          inStock: filters.inStock || undefined,
          sortBy: filters.sortBy || undefined,
          order: filters.order || undefined
        };
        
        const data = await getAllProducts(params);
        
        setProducts(data.products);
        setPagination({
          page: data.page,
          pages: data.pages,
          totalProducts: data.totalProducts,
          hasMore: data.hasMore
        });
      } catch (error) {
        setError('Failed to load products. Please try again.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
    
    const newSearchParams = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== false) {
        newSearchParams[key] = value.toString();
      }
    });
    
    setSearchParams(newSearchParams);
  }, [filters, setSearchParams, retryCount]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: name !== 'page' ? 1 : prev.page
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    
    handleFilterChange('page', newPage);
    
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'createdAt',
      order: 'desc',
      page: 1
    });
  };

  return (
    <div className="product-list-container">
      <Row className="mb-4">
        <Col>
          <ProductFilter 
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </Col>
      </Row>
      
      {error && (
        <Alert variant="danger">
          {error}
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="ms-2" 
            onClick={() => {
              setRetryCount(retryCount + 1);
            }}
          >
            Retry
          </Button>
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center my-5">
          <Alert variant="info">
            No products found matching your filters. Try adjusting your search criteria.
          </Alert>
        </div>
      ) : (
        <>
          <Row className="mb-3">
            <Col>
              <p style={{color:"white"}}>Showing {products.length} of {pagination.totalProducts} products</p>
            </Col>
          </Row>
          
          <Row xs={1} sm={2} md={3} lg={4} className="g-4" >
            {products.map(product => (
              <Col key={product._id} >
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          
          {pagination.pages > 1 && (
            <Row className="my-4" >
              <Col className="d-flex justify-content-center" >
                <Pagination 
                  currentPage={pagination.page} 
                  totalPages={pagination.pages} 
                  onPageChange={handlePageChange} 
                />
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};

ProductList.propTypes = {
  isAdmin: PropTypes.bool
};

export default ProductList;