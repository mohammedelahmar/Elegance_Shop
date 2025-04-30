import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import Button from '../UI/Button';
import Input from '../UI/Input';

const Header = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get cart state from Redux
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const cartItemsCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeNavbar = () => setExpanded(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      closeNavbar();
    }
  };

  return (
    <Navbar bg="light" variant="light" expand="lg" sticky="top" expanded={expanded} className="shadow-sm mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={closeNavbar}>
          My E-Shop
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={closeNavbar}>Home</Nav.Link>
            <Nav.Link as={Link} to="/products" onClick={closeNavbar}>Products</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={closeNavbar}>About</Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={closeNavbar}>Contact</Nav.Link>
            
            {isAuthenticated && isAdmin && (
              <NavDropdown title="Admin" id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/admin/dashboard" onClick={closeNavbar}>
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/products" onClick={closeNavbar}>
                  Products
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/orders" onClick={closeNavbar}>
                  Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users" onClick={closeNavbar}>
                  Users
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

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
              >
                <NavDropdown.Item as={Link} to="/profile" onClick={closeNavbar}>
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders" onClick={closeNavbar}>
                  My Orders
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => { handleLogout(); closeNavbar(); }}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary" 
                  className="me-2"
                  onClick={closeNavbar}
                  icon={FaUser}
                  size="sm"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary"
                  onClick={closeNavbar}
                  size="sm"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;