import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Spinner, Button, ListGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import ProfileForm from '../components/Auth/ProfileForm';
import ChangePasswordForm from '../components/Auth/ChangePasswordForm'; // Import the new component
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { FaUser, FaShoppingBag, FaAddressCard, FaLock, FaHeart, FaEye, FaShoppingCart, FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaCity, FaGlobe, FaPhone } from 'react-icons/fa';
import RecentlyViewed from '../components/Product/RecentlyViewed';
import WishlistList from '../components/wishlist/WishlistList';
import './ProfilePage.css';
import axios from '../api/axios';
import Message from '../components/UI/Message';
import { getMyOrders } from '../api/order';
import OrderList from '../components/Order/OrderList';
import LoadingAnimation from '../components/common/LoadingAnimation';

const ProfilePage = () => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const { wishlistItems, loading: wishlistLoading, error: wishlistError, fetchWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('personal');
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Fetch wishlist when the wishlist tab is activated
  useEffect(() => {
    if (activeTab === 'wishlist' && isAuthenticated) {
      fetchWishlist();
    }
  }, [activeTab, isAuthenticated, fetchWishlist]);

  // Fetch addresses when the addresses tab is activated
  useEffect(() => {
    if (activeTab === 'addresses' && isAuthenticated) {
      fetchUserAddresses();
    }
  }, [activeTab, isAuthenticated]);

  // Fetch orders when the orders tab is activated
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      fetchUserOrders();
    }
  }, [activeTab, isAuthenticated]);

  const fetchUserAddresses = async () => {
    try {
      setAddressesLoading(true);
      setAddressesError(null);
      // Make API call to get user addresses
      const { data } = await axios.get('/addresses/user');
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddressesError(error.response?.data?.message || 'Failed to load addresses');
    } finally {
      setAddressesLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrdersError(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`/addresses/${id}`);
        fetchUserAddresses(); // Refresh the list
      } catch (error) {
        setAddressesError(error.response?.data?.message || 'Failed to delete address');
      }
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <LoadingAnimation size="large" text="Loading your profile..." />
      </Container>
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
                        {wishlistItems.length > 0 && (
                          <span className="badge rounded-pill bg-primary bg-opacity-25 ms-2">
                            {wishlistItems.length}
                          </span>
                        )}
                      </Nav.Link>
                      <Nav.Link 
                        className={`profile-nav-link ${activeTab === 'addresses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('addresses')}
                      >
                        <FaAddressCard /> Addresses
                        {addresses.length > 0 && (
                          <span className="badge rounded-pill bg-primary bg-opacity-25 ms-2">
                            {addresses.length}
                          </span>
                        )}
                      </Nav.Link>
                      <Nav.Link 
                        className={`profile-nav-link ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                      >
                        <FaLock /> Security
                      </Nav.Link>
                      <Nav.Link 
                        className={`profile-nav-link ${activeTab === 'recent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recent')}
                      >
                        <FaEye /> Recently Viewed
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
                        {activeTab === 'recent' && 'Recently Viewed Items'}
                      </h3>
                      
                      {activeTab === 'wishlist' && wishlistItems.length > 0 && (
                        <Link to="/wishlist" className="btn btn-primary btn-sm">
                          <FaShoppingCart className="me-1" /> View Full Wishlist
                        </Link>
                      )}

                      {activeTab === 'addresses' && (
                        <Button 
                          variant="primary"
                          size="sm"
                          as={Link}
                          to="/address/new" // Changed from /checkout?newAddress=true
                        >
                          <FaPlus className="me-1" /> Add New Address
                        </Button>
                      )}
                    </div>
                    
                    {activeTab === 'personal' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProfileForm />
                        <div className="mt-5">
                          <RecentlyViewed />
                        </div>
                      </motion.div>
                    )}
                    
                    {activeTab === 'orders' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {ordersLoading ? (
                          <div className="text-center py-5">
                            <LoadingAnimation text="Loading your orders..." />
                          </div>
                        ) : ordersError ? (
                          <Message variant="danger">{ordersError}</Message>
                        ) : orders.length === 0 ? (
                          <div className="text-center py-4">
                            <FaShoppingBag size={40} className="text-white-50 mb-3" />
                            <h5 className="text-white">No Orders Found</h5>
                            <p className="text-white-50">
                              You haven't placed any orders yet
                            </p>
                            <Button 
                              as={Link} 
                              to="/products" 
                              variant="outline-primary" 
                              className="mt-3"
                            >
                              Start Shopping
                            </Button>
                          </div>
                        ) : (
                          <div className="order-history-container">
                            <OrderList orders={orders} />
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {activeTab === 'wishlist' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <WishlistList 
                          products={wishlistItems} 
                          loading={wishlistLoading}
                          error={wishlistError}
                        />
                      </motion.div>
                    )}
                    
                    {activeTab === 'addresses' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {addressesLoading ? (
                          <div className="text-center py-4">
                            <LoadingAnimation text="Loading your addresses..." />
                          </div>
                        ) : addressesError ? (
                          <Message variant="danger">{addressesError}</Message>
                        ) : addresses.length === 0 ? (
                          <div className="text-center py-4">
                            <FaAddressCard size={40} className="text-white-50 mb-3" />
                            <h5 className="text-white">No Addresses Found</h5>
                            <p className="text-white-50">
                              You haven't added any addresses yet.
                            </p>
                            <Button 
                              variant="primary"
                              className="mt-3"
                              as={Link}
                              to="/address/new" // Changed from /checkout?newAddress=true
                            >
                              <FaPlus className="me-2" /> Add Your First Address
                            </Button>
                          </div>
                        ) : (
                          <Row>
                            {addresses.map((address, index) => (
                              <Col md={6} className="mb-4" key={address._id} style={{'--index': index}}>
                                <Card className="address-card h-100">
                                  <Card.Body>
                                    <div className="d-flex justify-content-between mb-3">
                                      <h5 className="mb-0">Shipping Address</h5>
                                      <div className="address-card-actions">
                                        <Button 
                                          variant="link" 
                                          size="sm" 
                                          className="p-1 me-2 text-info"
                                          as={Link}
                                          to={`/address/edit?id=${address._id}`} // Changed from /checkout?editAddress=
                                        >
                                          <FaEdit />
                                        </Button>
                                        <Button 
                                          variant="link" 
                                          size="sm" 
                                          className="p-1 text-danger"
                                          onClick={() => handleDeleteAddress(address._id)}
                                        >
                                          <FaTrash />
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <ListGroup variant="flush">
                                      <ListGroup.Item className="d-flex align-items-start">
                                        <FaMapMarkerAlt className="me-3" />
                                        <div className="flex-grow-1">{address.address}</div>
                                      </ListGroup.Item>
                                      <ListGroup.Item className="d-flex align-items-start">
                                        <FaCity className="me-3" />
                                        <div className="flex-grow-1">{address.city}, {address.postal_code}</div>
                                      </ListGroup.Item>
                                      <ListGroup.Item className="d-flex align-items-start">
                                        <FaGlobe className="me-3" />
                                        <div className="flex-grow-1">{address.country}</div>
                                      </ListGroup.Item>
                                      <ListGroup.Item className="d-flex align-items-start">
                                        <FaPhone className="me-3" />
                                        <div className="flex-grow-1">{address.phone_number}</div>
                                      </ListGroup.Item>
                                    </ListGroup>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        )}
                      </motion.div>
                    )}
                    
                    {activeTab === 'security' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChangePasswordForm />
                        
                        <hr className="my-5 border-top border-secondary" />
                        
                        <div className="security-section">
                          <h3 className="form-section-header">Account Security</h3>
                          
                          <Card className="bg-dark border-0 mb-3">
                            <Card.Body>
                              <div className="d-flex align-items-center">
                                <div className="security-icon me-3">
                                  <FaLock size={24} />
                                </div>
                                <div>
                                  <h5 className="mb-1">Two-Factor Authentication</h5>
                                  <p className="text-white-50 mb-0">Add an extra layer of security to your account</p>
                                </div>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="ms-auto"
                                  disabled
                                >
                                  Coming Soon
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                          
                          <Card className="bg-dark border-0">
                            <Card.Body>
                              <div className="d-flex align-items-center">
                                <div className="security-icon me-3">
                                  <FaUser size={24} />
                                </div>
                                <div>
                                  <h5 className="mb-1">Account Activity</h5>
                                  <p className="text-white-50 mb-0">Review your recent sign-in activity</p>
                                </div>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="ms-auto"
                                  disabled
                                >
                                  Coming Soon
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      </motion.div>
                    )}
                    
                    {activeTab === 'recent' && (
                      <div className="mt-4">
                        <RecentlyViewed />
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