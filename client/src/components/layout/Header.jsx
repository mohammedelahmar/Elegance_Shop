import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
<<<<<<< HEAD
import { FaShoppingCart, FaUser, FaTags, FaClipboardList, FaHome, FaInfoCircle, FaEnvelope, FaSearch, FaCog } from 'react-icons/fa';
=======
import { FaShoppingCart, FaUser, FaSearch, FaHeart } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';
>>>>>>> 22cdfcb56051e958198f4c0ce92695c5f23cf4bf
import Button from '../UI/Button';
import './Header.css';

const Header = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
<<<<<<< HEAD
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
=======
  const [searchTerm, setSearchTerm] = useState('');
  const { wishlistCount } = useWishlist();
>>>>>>> 22cdfcb56051e958198f4c0ce92695c5f23cf4bf

  // Get cart state from Redux
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const cartItemsCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeNavbar = () => setExpanded(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    return path !== '/' && location.pathname.startsWith(path);
  };

  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
  };

  const handleSearchBlur = () => {
    if (searchExpanded && window.innerWidth > 991) {
      // Small delay to allow for clicking the search icon
      setTimeout(() => setSearchExpanded(false), 200);
    }
  };

  return (
    <Navbar 
      expand="lg" 
      expanded={expanded} 
      className={`main-navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      fixed="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={closeNavbar} className="brand">
          <span className="brand-text">Elegance</span>
          <span className="brand-accent">Shop</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-nav" onClick={() => setExpanded(!expanded)} />
        
        <Navbar.Collapse id="main-nav">
          <Nav className="mx-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              onClick={closeNavbar} 
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
            >
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/products" 
              onClick={closeNavbar} 
              className={`nav-item ${isActive('/products') ? 'active' : ''}`}
            >
              <FaTags className="nav-icon" />
              <span>Products</span>
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              onClick={closeNavbar}
              className={`nav-item ${isActive('/about') ? 'active' : ''}`}
            >
              <FaInfoCircle className="nav-icon" />
              <span>About</span>
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              onClick={closeNavbar}
              className={`nav-item ${isActive('/contact') ? 'active' : ''}`}
            >
              <FaEnvelope className="nav-icon" />
              <span>Contact</span>
            </Nav.Link>
            
            {isAuthenticated && isAdmin && (
              <NavDropdown 
                title={<span className="admin-dropdown"><FaCog className="nav-icon" /> Admin</span>} 
                id="admin-dropdown"
                className={`${isActive('/admin') ? 'active' : ''}`}
              >
                <NavDropdown.Item as={Link} to="/admin/dashboard" onClick={closeNavbar} className="dropdown-item">
                  Dashboard
                </NavDropdown.Item>
                
                <div className="admin-dropdown-header">Products</div>
                <NavDropdown.Item as={Link} to="/admin/products" onClick={closeNavbar} className="dropdown-item">
                  Products
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/categories" onClick={closeNavbar} className="dropdown-item">
                  Categories
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/variants" onClick={closeNavbar} className="dropdown-item">
                  Variants
                </NavDropdown.Item>
                
                <div className="admin-dropdown-header">Users & Orders</div>
                <NavDropdown.Item as={Link} to="/admin/orders" onClick={closeNavbar} className="dropdown-item">
                  Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users" onClick={closeNavbar} className="dropdown-item">
                  Users
                </NavDropdown.Item>
                
                <div className="admin-dropdown-header">Other</div>
                <NavDropdown.Item as={Link} to="/admin/reviews" onClick={closeNavbar} className="dropdown-item">
                  Reviews
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/addresses" onClick={closeNavbar} className="dropdown-item">
                  Addresses
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

<<<<<<< HEAD
          <div className="d-flex align-items-center">
            <div className="navbar-actions">
              <Nav.Link 
                as={Link} 
                to="/cart" 
                onClick={closeNavbar} 
                className={`cart-link ${isActive('/cart') ? 'active' : ''}`}
=======
          <form className="d-flex me-3 my-2 my-lg-0" onSubmit={handleSearch}>
            <div className="d-flex">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={FaSearch}
                iconPosition="right"
                className="me-2"
                fullWidth={false}
              />
            </div>
          </form>

          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/wishlist" className="me-3" onClick={closeNavbar}>
              <FaHeart className="me-1" />
              Wishlist
              {wishlistCount > 0 && (
                <Badge bg="danger" pill className="ms-1">
                  {wishlistCount}
                </Badge>
              )}
            </Nav.Link>

            <Nav.Link as={Link} to="/cart" className="me-3" onClick={closeNavbar}>
              <FaShoppingCart className="me-1" />
              Cart
              {cartItemsCount > 0 && (
                <Badge bg="danger" pill className="ms-1">
                  {cartItemsCount}
                </Badge>
              )}
            </Nav.Link>

            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span>
                    <FaUser className="me-1" />
                    {currentUser?.Firstname || 'Account'}
                  </span>
                } 
                id="user-dropdown"
>>>>>>> 22cdfcb56051e958198f4c0ce92695c5f23cf4bf
              >
                <div className="cart-icon-container">
                  <FaShoppingCart className="cart-icon" />
                  {cartItemsCount > 0 && (
                    <Badge className="cart-badge">
                      {cartItemsCount}
                    </Badge>
                  )}
                </div>
              </Nav.Link>

              {isAuthenticated ? (
                <NavDropdown 
                  title={
                    <div className="user-dropdown-toggle">
                      <FaUser className="user-icon" />
                      <span className="user-name">{currentUser?.Firstname || 'Account'}</span>
                    </div>
                  } 
                  id="user-dropdown"
                  align="end"
                >
                  <div className="dropdown-user-header">
                    <strong>Hello, {currentUser?.Firstname || 'User'}</strong>
                  </div>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/profile" onClick={closeNavbar} className="dropdown-item">
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orders" onClick={closeNavbar} className="dropdown-item">
                    <FaClipboardList className="me-2" />
                    My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => { handleLogout(); closeNavbar(); }} className="dropdown-item logout">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div className="auth-buttons">
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="text"
                    onClick={closeNavbar}
                    className="login-btn"
                  >
                    Login
                  </Button>
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="primary"
                    onClick={closeNavbar}
                    className="register-btn"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;