import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaSync } from 'react-icons/fa';
import { getAllUsers } from '../../api/user';
import UserList from '../../components/Admin/Users/UserList';
import UserEdit from '../../components/Admin/Users/UserEdit';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import Message from '../../components/UI/Message';
import './UsersPage.css';

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
    <Container fluid className="py-3 users-admin-container">
      <Row className="users-admin-header-row">
        <Col>
          <h1 className="users-admin-title">User Management</h1>
        </Col>
        <Col xs="auto" className="users-admin-actions">
          <Button 
            variant="outline-primary" 
            onClick={handleRefresh}
          >
            <FaSync /> Refresh
          </Button>
        </Col>
      </Row>

      {loading ? (
        <LoadingAnimation text="Loading users..." />
      ) : error ? (
        <Message variant="danger" className="mb-3">{error}</Message>
      ) : (
        <div className="users-admin-card">
            <UserList 
              users={users} 
              onEditUser={handleEditUser} 
              onUserUpdated={handleRefresh}
            />
        </div>
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