import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUserPlus, FaSync } from 'react-icons/fa';
import { getAllUsers } from '../../api/user';
import UserList from '../../components/Admin/Users/UserList';
import UserEdit from '../../components/Admin/Users/UserEdit';
import Loader from '../../components/UI/Loader';
import Message from '../../components/UI/Message';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditUser(null);
  };

  const handleUserUpdated = () => {
    handleRefresh();
    handleCloseModal();
  };

  return (
    <Container fluid className="py-3">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="h3 mb-0">User Management</h1>
        </Col>
        <Col xs="auto">
          <Button 
            variant="outline-primary" 
            className="me-2" 
            onClick={handleRefresh}
          >
            <FaSync /> Refresh
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card>
          <Card.Body>
            <UserList 
              users={users} 
              onEditUser={handleEditUser} 
              onUserUpdated={handleRefresh}
            />
          </Card.Body>
        </Card>
      )}

      {showEditModal && (
        <UserEdit
          user={editUser}
          show={showEditModal}
          onHide={handleCloseModal}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </Container>
  );
};

export default UsersPage;