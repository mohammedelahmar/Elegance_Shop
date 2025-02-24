import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);
  
  // Add this CSS for custom styles
  const styles = `
    .nav-gradient {
      background: linear-gradient(145deg, #2c3e50, #3498db);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .nav-brand {
      background: linear-gradient(45deg, #fff, #f1c40f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
      letter-spacing: 1.5px;
      transition: all 0.3s ease;
    }
    
    .nav-brand:hover {
      transform: scale(1.05);
    }
    
    .nav-link-custom {
      color: rgba(255,255,255,0.8) !important;
      margin: 0 15px;
      padding: 8px 15px !important;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .nav-link-custom:hover {
      color: white !important;
      transform: translateY(-2px);
    }
    
    .nav-link-custom::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: #f1c40f;
      transition: width 0.3s ease;
    }
    
    .nav-link-custom:hover::before {
      width: 100%;
    }
    
    .btn-custom {
      background: linear-gradient(45deg, #3498db, #2c3e50);
      color: white !important;
      border: none;
      padding: 10px 25px !important;
      border-radius: 30px;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-custom:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .cart-counter {
      background: #e74c3c;
      color: white;
      padding: 3px 8px;
      border-radius: 15px;
      font-size: 0.8rem;
      margin-left: 5px;
    }
    
    @media (max-width: 991px) {
      .navbar-collapse {
        background: rgba(44,62,80,0.95);
        padding: 20px;
        border-radius: 15px;
        margin-top: 10px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar navbar-expand-lg navbar-dark py-3 sticky-top nav-gradient">
        <div className="container">
          <NavLink className="navbar-brand nav-brand fs-4" to="/">
            Srbi mab9ach
          </NavLink>
          
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
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
            
            <div className="d-flex gap-3">
              <NavLink to="/login" className="btn btn-custom">
                <i className="fas fa-sign-in-alt"></i>
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-custom">
                <i className="fas fa-user-plus"></i>
                Register
              </NavLink>
              <NavLink to="/cart" className="btn btn-custom position-relative">
                <i className="fas fa-shopping-cart"></i>
                Cart
                <span className="cart-counter position-absolute top-0 start-100 translate-middle">
                  {state.length}
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;