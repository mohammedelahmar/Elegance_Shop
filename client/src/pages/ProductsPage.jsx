import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductList from '../components/Product/ProductList';


const ProductsPage = () => {
  return (
    <Container className="py-5" >
      <Row >
        <Col >
          <h1 className="mb-4" style={{color:'white'}}>Our Products</h1>
          <ProductList />
        </Col>
      </Row >
    </Container>
  );
};

export default ProductsPage;