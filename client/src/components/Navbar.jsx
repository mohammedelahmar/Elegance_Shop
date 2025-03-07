import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const styles = `
    .navbar {
      transition: all 0.3s ease;
      padding: ${scrolled ? '0.5rem 0' : '1rem 0'};
    }
    
    .navbar-scrolled {
      background-color: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    .navbar-transparent {
      background-color: rgba(15, 23, 42, 0.85);
    }
    
    .nav-brand {
      font-weight: 700;
      letter-spacing: 1px;
      color: white;
      position: relative;
      padding-bottom: 3px;
      transition: all 0.3s ease;
    }
    
    .nav-brand::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40%;
      height: 2px;
      background: #60a5fa;
      transition: width 0.3s ease;
    }
    
    .nav-brand:hover::after {
      width: 100%;
    }
    
    .nav-link-custom {
      color: rgba(255, 255, 255, 0.8) !important;
      margin: 0 10px;
      padding: 8px 15px !important;
      border-radius: 6px;
      transition: all 0.2s ease;
      position: relative;
      font-weight: 500;
      letter-spacing: 0.3px;
    }
    
    .nav-link-custom:hover, .nav-link-custom.active {
      color: white !important;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .btn-nav {
      padding: 8px 18px !important;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-weight: 500;
      letter-spacing: 0.3px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-primary-nav {
      background-color: #3b82f6;
      color: white !important;
      border: none;
    }
    
    .btn-primary-nav:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    .btn-outline-nav {
      background-color: transparent;
      color: white !important;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .btn-outline-nav:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }
    
    .cart-counter {
      background: #60a5fa;
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 500;
    }
    
    @media (max-width: 991px) {
      .navbar-collapse {
        background: rgba(15, 23, 42, 0.98);
        margin-top: 10px;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      }
      
      .buttons-container {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <nav className={`navbar navbar-expand-lg navbar-dark sticky-top ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
        <div className="container">
          <NavLink className="navbar-brand nav-brand fs-4 text-decoration-none" to="/">
            ShopIt WearIt
          </NavLink>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink 
                  exact
                  className="nav-link nav-link-custom"
                  activeClassName="active"
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link nav-link-custom"
                  activeClassName="active"
                  to="/product"
                  
                >
                  Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link nav-link-custom"
                  activeClassName="active"
                  to="/about"
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link nav-link-custom"
                  activeClassName="active"
                  to="/contact"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
            
            <div className="d-flex gap-3 buttons-container">
              <NavLink to="/login" className="btn btn-outline-nav">
                <i className="fas fa-sign-in-alt"></i>
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-outline-nav">
                <i className="fas fa-user-plus"></i>
                Register
              </NavLink>
              <NavLink to="/cart" className="btn btn-primary-nav position-relative">
                <i className="fas fa-shopping-cart"></i>
                Cart
                {state.length > 0 && (
                  <span className="cart-counter position-absolute top-0 start-100 translate-middle">
                    {state.length}
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;