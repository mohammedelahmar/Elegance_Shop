import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProfileForm from '../components/Auth/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">My Profile</h2>
          <ProfileForm />
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;