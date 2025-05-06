import React, { useState } from 'react';
import { Nav, Collapse, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaTags,
  FaCommentAlt,
  FaAngleDown,
  FaAngleUp,
  FaSignOutAlt,
  FaPuzzlePiece,
  FaMapMarkerAlt,
  FaHeart
} from 'react-icons/fa';
import Button from '../UI/Button';
import { useWishlist } from '../../context/WishlistContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;
  
  const [expanded, setExpanded] = useState({
    products: false,
    users: false
  });
  
  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const { wishlistCount } = useWishlist();
  
  return (
    <div className="sidebar text-white">
      <div className="p-3 d-flex justify-content-between align-items-center">
        <h5 className="text-uppercase m-0">Admin Dashboard</h5>
      </div>

      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/admin/dashboard" 
          className={isActive('/admin/dashboard') ? 'active' : ''}
        >
          <FaHome className="sidebar-icon" /> Dashboard
        </Nav.Link>

        <div>
          <Nav.Link 
            className={`d-flex justify-content-between ${isActive('/admin/products') ? 'active' : ''}`}
            onClick={() => toggleSection('products')}
          >
            <div>
              <FaBox className="sidebar-icon" /> Products
            </div>
            {expanded.products ? <FaAngleUp /> : <FaAngleDown />}
          </Nav.Link>
          
          <Collapse in={expanded.products}>
            <div>
              <Nav className="flex-column ms-3">
                <Nav.Link 
                  as={Link} 
                  to="/admin/products"
                  className={pathname === '/admin/products' ? 'active' : ''}
                >
                  All Products
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/admin/products/add"
                  className={pathname === '/admin/products/add' ? 'active' : ''}
                >
                  Add Product
                </Nav.Link>
              </Nav>
            </div>
          </Collapse>
        </div>

        <Nav.Link 
          as={Link} 
          to="/admin/variants" 
          className={isActive('/admin/variants') ? 'active' : ''}
        >
          <FaPuzzlePiece className="sidebar-icon" /> Variants
        </Nav.Link>

        <Nav.Link 
          as={Link} 
          to="/admin/categories" 
          className={isActive('/admin/categories') ? 'active' : ''}
        >
          <FaTags className="sidebar-icon" /> Categories
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/admin/orders" 
          className={isActive('/admin/orders') ? 'active' : ''}
        >
          <FaShoppingCart className="sidebar-icon" /> Orders
        </Nav.Link>

        <div>
          <Nav.Link 
            className={`d-flex justify-content-between ${isActive('/admin/users') ? 'active' : ''}`}
            onClick={() => toggleSection('users')}
          >
            <div>
              <FaUsers className="sidebar-icon" /> Users
            </div>
            {expanded.users ? <FaAngleUp /> : <FaAngleDown />}
          </Nav.Link>
          
          <Collapse in={expanded.users}>
            <div>
              <Nav className="flex-column ms-3">
                <Nav.Link 
                  as={Link} 
                  to="/admin/users"
                  className={pathname === '/admin/users' ? 'active' : ''}
                >
                  All Users
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/admin/users/add"
                  className={pathname === '/admin/users/add' ? 'active' : ''}
                >
                  Add User
                </Nav.Link>
              </Nav>
            </div>
          </Collapse>
        </div>

        <Nav.Link 
          as={Link} 
          to="/admin/reviews"
          className={isActive('/admin/reviews') ? 'active' : ''}
        >
          <FaCommentAlt className="sidebar-icon" /> Reviews
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/admin/statistics" 
          className={isActive('/admin/statistics') ? 'active' : ''}
        >
          <FaChartBar className="sidebar-icon" /> Statistics
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/admin/settings" 
          className={isActive('/admin/settings') ? 'active' : ''}
        >
          <FaCog className="sidebar-icon" /> Settings
        </Nav.Link>

        <Nav.Link 
          as={Link} 
          to="/admin/addresses" 
          className={isActive('/admin/addresses') ? 'active' : ''}
        >
          <FaMapMarkerAlt className="sidebar-icon" /> Addresses
        </Nav.Link>

        <Nav.Link as={Link} to="/wishlist" className="d-flex align-items-center">
          <FaHeart className="me-2" />
          <span>Wishlist</span>
          {wishlistCount > 0 && (
            <Badge bg="danger" pill className="ms-1">
              {wishlistCount}
            </Badge>
          )}
        </Nav.Link>

        <div className="mt-auto p-3">
          <Button
            variant="outline-danger"
            fullWidth
            icon={FaSignOutAlt}
            onClick={() => console.log('Logging out')}
          >
            Logout
          </Button>
        </div>
      </Nav>
    </div>
  );
};

export default Sidebar;