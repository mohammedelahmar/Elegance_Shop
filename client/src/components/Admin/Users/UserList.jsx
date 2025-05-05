import React, { useState } from 'react';
import { Table, Button, InputGroup, Form, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaUserShield } from 'react-icons/fa';
import { deleteUser, promoteUser } from '../../../api/user';
import Message from '../../UI/Message';
import PropTypes from 'prop-types';
import '../Categories/CategoryList.css'; // Use the same CSS as CategoryList for consistent style

const UserList = ({ users, onEditUser, onUserUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.Firstname?.toLowerCase().includes(term) ||
      user.Lastname?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone_number?.includes(term) ||
      user.role?.toLowerCase().includes(term)
    );
  });

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        setActionLoading(true);
        await deleteUser(userId);
        setMessageType('success');
        setMessage(`User "${userName}" has been deleted successfully`);
        setShowMessage(true);
        onUserUpdated();
      } catch (error) {
        setMessageType('danger');
        setMessage(`Error: ${error.response?.data?.message || error.message}`);
        setShowMessage(true);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handlePromoteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to promote "${userName}" to admin?`)) {
      try {
        setActionLoading(true);
        await promoteUser(userId);
        setMessageType('success');
        setMessage(`User "${userName}" has been promoted to admin`);
        setShowMessage(true);
        onUserUpdated();
      } catch (error) {
        setMessageType('danger');
        setMessage(`Error: ${error.response?.data?.message || error.message}`);
        setShowMessage(true);
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <>
      {showMessage && (
        <Message 
          variant={messageType} 
          onClose={() => setShowMessage(false)} 
          dismissible
        >
          {message}
        </Message>
      )}
      
      <div className="category-list-card"> {/* Use same card class as CategoryList */}
        <div className="category-search-bar mb-4"> {/* Use same search bar class */}
          <InputGroup>
            <InputGroup.Text id="search-addon" className="category-search-icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search"
              aria-describedby="search-addon"
              className="category-search-input"
            />
          </InputGroup>
        </div>

        <div className="table-responsive">
          <Table hover className="category-table"> {/* Use same table class */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user._id.substring(user._id.length - 6).toUpperCase()}</td>
                    <td>{`${user.Firstname} ${user.Lastname}`}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number}</td>
                    <td>
                      <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => onEditUser(user)}
                          title="Edit User"
                          disabled={actionLoading}
                        >
                          <FaEdit />
                        </Button>
                        {user.role !== 'admin' && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handlePromoteUser(user._id, `${user.Firstname} ${user.Lastname}`)}
                            title="Promote to Admin"
                            disabled={actionLoading}
                          >
                            <FaUserShield />
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id, `${user.Firstname} ${user.Lastname}`)}
                          title="Delete User"
                          disabled={actionLoading || user.role === 'admin'}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
        <div className="mt-2 text-muted small">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </>
  );
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  onEditUser: PropTypes.func.isRequired,
  onUserUpdated: PropTypes.func.isRequired
};

export default UserList;