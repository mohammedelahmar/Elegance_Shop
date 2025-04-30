import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RegisterForm from '../components/Auth/RegisterForm';

const RegisterPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Create an Account</h2>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;