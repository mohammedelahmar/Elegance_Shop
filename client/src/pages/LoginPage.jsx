import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Login</h2>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;