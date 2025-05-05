import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaSync } from 'react-icons/fa';
import { getAllAddresses } from '../../api/address';
import AddressList from '../../components/Admin/Addresses/AddressList';
import AddressEdit from '../../components/Admin/Addresses/AddressEdit';
import AddressDetail from '../../components/Admin/Addresses/AddressDetail';
import Loader from '../../components/UI/Loader';
import Message from '../../components/UI/Message';
import '../../components/Admin/Addresses/AddressList.css'; // Import the new CSS

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const [viewAddress, setViewAddress] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const data = await getAllAddresses();
        setAddresses(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    setActionSuccess(null);
  };

  const handleEditAddress = (address) => {
    setEditAddress(address);
    setShowEditModal(true);
  };

  const handleViewAddress = (address) => {
    setViewAddress(address);
    setShowDetailModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditAddress(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setViewAddress(null);
  };

  const handleAddressUpdated = () => {
    setActionSuccess('Address updated successfully');
    handleRefresh();
    handleCloseEditModal();
  };

  const handleAddressDeleted = () => {
    setActionSuccess('Address deleted successfully');
    handleRefresh();
  };

  return (
    <Container fluid className="py-3" style={{ background: '#111827', minHeight: '100vh', color: '#fff' }}>
      {/* Header Row */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="h3 mb-0 address-page-header">Address Management</h1>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={handleRefresh}
            style={{
              background: '#4a6bf5', 
              borderColor: '#4a6bf5'
            }}
          >
            <FaSync /> Refresh
          </Button>
        </Col>
      </Row>

      {actionSuccess && (
        <Message 
          variant="success" 
          dismissible 
          onClose={() => setActionSuccess(null)}
          className="mb-4"
        >
          {actionSuccess}
        </Message>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="address-list-card">
          <AddressList 
            addresses={addresses} 
            onEditAddress={handleEditAddress} 
            onViewAddress={handleViewAddress}
            onAddressDeleted={handleAddressDeleted}
          />
        </div>
      )}

      {showEditModal && (
        <AddressEdit
          address={editAddress}
          show={showEditModal}
          onHide={handleCloseEditModal}
          onAddressUpdated={handleAddressUpdated}
        />
      )}

      {showDetailModal && (
        <AddressDetail
          address={viewAddress}
          show={showDetailModal}
          onHide={handleCloseDetailModal}
          onEdit={() => {
            handleCloseDetailModal();
            handleEditAddress(viewAddress);
          }}
        />
      )}
    </Container>
  );
};

export default AddressesPage;