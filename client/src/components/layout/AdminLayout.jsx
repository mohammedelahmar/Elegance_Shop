import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Sidebar from '../layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <Container fluid className="px-0">
        <Row className="g-0">
          <Col lg={2} className="px-0 bg-dark">
            <Sidebar />
          </Col>
          <Col lg={10} className="px-3 py-4">
            {children}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default AdminLayout;