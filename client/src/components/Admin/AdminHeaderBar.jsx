import React from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import './AdminHeaderBar.css';

const AdminHeaderBar = ({ onSidebarToggle }) => {
  return (
    <header className="admin-headerbar" >
      <button className="sidebar-toggle-btn d-md-none" onClick={onSidebarToggle}>
        <FaBars size={22} />
      </button>
      <div className="admin-header-title" >Admin Dashboard</div>
      <div className="admin-header-user">
        <FaUserCircle size={28} className="me-2" />
        <span className="admin-header-username">Admin</span>
      </div>
    </header>
  );
};

export default AdminHeaderBar;
