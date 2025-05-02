import React from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Alert variant="warning" className="text-center p-5 shadow">
            <FaExclamationTriangle className="display-1 text-warning mb-4" />
            <h1 className="mb-4">Page Not Found</h1>
            <p className="mb-4 lead">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <div className="d-flex justify-content-center">
              <Button as={Link} to="/" variant="primary">
                <FaArrowLeft className="me-2" /> Back to Home
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;