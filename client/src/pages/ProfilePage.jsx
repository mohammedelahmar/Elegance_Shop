import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ProfileForm from '../components/Auth/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaAddressCard, FaLock, FaHeart } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ 
            width: "3rem", 
            height: "3rem",
            borderWidth: "0.3rem",
            color: "#4a9fff"
          }} />
          <p className="mt-3 text-white-50">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=profile" />;
  }

  // Get initial for avatar
  const getInitial = () => {
    if (currentUser?.Firstname) {
      return currentUser.Firstname.charAt(0).toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="py-5 profile-page">
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="profile-page-container">
              <div className="profile-header">
                <h1 className="mb-2 text-white">My Account</h1>
                <p className="text-white-50">Manage your profile information and preferences</p>
              </div>
              
              <Row>
                {/* Profile Sidebar */}
                <Col md={4} lg={3}>
                  <motion.div 
                    className="profile-avatar"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {currentUser?.profilePicture ? (
                      <img src={currentUser.profilePicture} alt="Profile" />
                    ) : (
                      <div className="avatar-letter">{getInitial()}</div>
                    )}
                  </motion.div>
                  
                  <div className="text-center mb-4">
                    <h4 className="text-white mb-1">{currentUser?.Firstname} {currentUser?.Lastname}</h4>
                    <p className="text-white-50 mb-0">{currentUser?.email}</p>
                  </div>
                  
                  <div className="profile-sections-nav mb-4">
                    <Nav className="flex-column">
                      <Nav.Link 
                        className={`profile-nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                      >
                        <FaUser /> Personal Info
                      </Nav.Link>
                      <Nav.Link 
                        className={`profile-nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                      >
                        <FaShoppingBag /> My Orders
                      </Nav.Link>
                      <Nav.Link 
                        className={`profile-nav-link ${activeTab === 'wishlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wishlist')}
                      >
                        <FaHeart /> Wishlist
                      </Nav.Link>
                      <Nav.Link 
                        className={`profile-nav-link ${activeTab === 'addresses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('addresses')}
                      >
                        <FaAddressCard /> Addresses
                      </Nav.Link>
                      <Nav.Link 
                        className={`profile-nav-link ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                      >
                        <FaLock /> Security
                      </Nav.Link>
                    </Nav>
                  </div>
                </Col>
                
                {/* Profile Content */}
                <Col md={8} lg={9}>
                  <Card className="profile-content-card border-0">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="mb-0">
                        {activeTab === 'personal' && 'Personal Information'}
                        {activeTab === 'orders' && 'My Orders'}
                        {activeTab === 'addresses' && 'My Addresses'}
                        {activeTab === 'security' && 'Security Settings'}
                        {activeTab === 'wishlist' && 'My Wishlist'}
                      </h3>
                    </div>
                    
                    {activeTab === 'personal' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProfileForm />
                      </motion.div>
                    )}
                    
                    {activeTab === 'orders' && (
                      <div className="text-center py-4">
                        <FaShoppingBag size={40} className="text-white-50 mb-3" />
                        <h5 className="text-white">Your Orders</h5>
                        <p className="text-white-50">
                          Your order history will appear here
                        </p>
                      </div>
                    )}
                    
                    {activeTab === 'wishlist' && (
                      <div className="text-center py-4">
                        <FaHeart size={40} className="text-white-50 mb-3" />
                        <h5 className="text-white">Your Wishlist</h5>
                        <p className="text-white-50">
                          Products you've saved will appear here
                        </p>
                      </div>
                    )}
                    
                    {activeTab === 'addresses' && (
                      <div className="text-center py-4">
                        <FaAddressCard size={40} className="text-white-50 mb-3" />
                        <h5 className="text-white">Your Addresses</h5>
                        <p className="text-white-50">
                          You can manage your shipping addresses here
                        </p>
                      </div>
                    )}
                    
                    {activeTab === 'security' && (
                      <div className="text-center py-4">
                        <FaLock size={40} className="text-white-50 mb-3" />
                        <h5 className="text-white">Security Settings</h5>
                        <p className="text-white-50">
                          Change password and security settings
                        </p>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default ProfilePage;