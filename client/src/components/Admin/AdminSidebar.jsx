import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaTags, FaUsers, FaShippingFast, FaStar, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './AdminSidebar.css';

const navLinks = [
  { to: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { to: '/admin/products', icon: <FaBox />, label: 'Products' },
  { to: '/admin/categories', icon: <FaTags />, label: 'Categories' },
  { to: '/admin/orders', icon: <FaShippingFast />, label: 'Orders' },
  { to: '/admin/users', icon: <FaUsers />, label: 'Users' },
  { to: '/admin/reviews', icon: <FaStar />, label: 'Reviews' },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  return (
    <aside className={`admin-sidebar${isOpen ? ' open' : ''}`}> 
      <div className="sidebar-header">
        <span className="sidebar-title">Admin</span>
        <button className="sidebar-close-btn d-md-none" onClick={onClose}><FaBars /></button>
      </div>
      <nav className="sidebar-nav">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link${location.pathname.startsWith(link.to) ? ' active' : ''}`}
            onClick={onClose}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-link logout-btn">
          <span className="sidebar-icon"><FaSignOutAlt /></span>
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
