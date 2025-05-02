import React, { useState } from 'react';
import { Table, Button, InputGroup, Form } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { deleteAddress } from '../../../api/address';
import Message from '../../UI/Message';
import PropTypes from 'prop-types';

const AddressList = ({ addresses, onEditAddress, onViewAddress, onAddressDeleted }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredAddresses = addresses.filter(address => {
    const searchText = searchTerm.toLowerCase();
    return (
      address.user?.Firstname?.toLowerCase().includes(searchText) ||
      address.user?.Lastname?.toLowerCase().includes(searchText) ||
      address.address?.toLowerCase().includes(searchText) ||
      address.city?.toLowerCase().includes(searchText) ||
      address.country?.toLowerCase().includes(searchText) ||
      address.postal_code?.toLowerCase().includes(searchText) ||
      address.phone_number?.includes(searchText)
    );
  });

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteAddress(addressId);
        onAddressDeleted();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {error && (
        <Message 
          variant="danger" 
          onClose={() => setError(null)} 
          dismissible
        >
          {error}
        </Message>
      )}
      
      <div className="mb-3">
        <InputGroup>
          <InputGroup.Text id="search-addon">
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search addresses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search"
            aria-describedby="search-addon"
          />
        </InputGroup>
      </div>

      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Address</th>
              <th>City</th>
              <th>Country</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAddresses.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-3">
                  No addresses found
                </td>
              </tr>
            ) : (
              filteredAddresses.map(address => (
                <tr key={address._id}>
                  <td>{address._id.substring(address._id.length - 6).toUpperCase()}</td>
                  <td>
                    {address.user ? (
                      `${address.user.Firstname || ''} ${address.user.Lastname || ''}`
                    ) : (
                      'Unknown User'
                    )}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }}>
                    {address.address}
                  </td>
                  <td>{address.city}</td>
                  <td>{address.country}</td>
                  <td>{address.phone_number}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-info" 
                        size="sm" 
                        onClick={() => onViewAddress(address)}
                        title="View Address Details"
                      >
                        <FaEye />
                      </Button>
                      
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => onEditAddress(address)}
                        title="Edit Address"
                      >
                        <FaEdit />
                      </Button>
                      
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteAddress(address._id)}
                        disabled={loading}
                        title="Delete Address"
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
        Showing {filteredAddresses.length} of {addresses.length} addresses
      </div>
    </>
  );
};

AddressList.propTypes = {
  addresses: PropTypes.array.isRequired,
  onEditAddress: PropTypes.func.isRequired,
  onViewAddress: PropTypes.func.isRequired,
  onAddressDeleted: PropTypes.func.isRequired
};

export default AddressList;