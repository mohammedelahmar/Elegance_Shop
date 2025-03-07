import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerStyles = `
    .footer {
      background-color: #0f172a;
      color: rgba(255, 255, 255, 0.7);
      padding: 5rem 0 2rem;
      margin-top: auto;
      position: relative;
      overflow: hidden;
    }
    
    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
    }
    
    .footer-heading {
      color: #ffffff;
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
      letter-spacing: 1px;
      position: relative;
      display: inline-block;
      padding-bottom: 8px;
    }
    
    .footer-heading::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 2px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    }
    
    .footer-paragraph {
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.95rem;
    }
    
    .footer-links {
      display: flex;
      flex-direction: column;
    }
    
    .footer-link {
      color: rgba(255, 255, 255, 0.6) !important;
      text-decoration: none;
      padding: 0.5rem 0;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      font-size: 0.95rem;
    }
    
    .footer-link:hover {
      color: #60a5fa !important;
      transform: translateX(5px);
    }
    
    .footer-link i {
      margin-right: 8px;
      font-size: 0.75rem;
      opacity: 0.7;
    }
    
    .social-icons {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .social-icon:hover {
      background: rgba(96, 165, 250, 0.2);
      color: #60a5fa;
      transform: translateY(-3px);
    }
    
    .creator-text {
      background: linear-gradient(45deg, #60a5fa, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 600;
    }
    
    .copyright {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 1.5rem;
      margin-top: 3rem;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
    }
    
    .copyright a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .copyright a:hover {
      color: #60a5fa;
    }
    
    .footer-brand {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(90deg, #60a5fa, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
      letter-spacing: 1px;
    }
    
    .newsletter-input {
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 10px 15px;
      border-radius: 6px;
      font-size: 0.9rem;
      width: 100%;
      margin-bottom: 1rem;
    }
    
    .newsletter-input:focus {
      outline: none;
      border-color: rgba(96, 165, 250, 0.5);
      background-color: rgba(255, 255, 255, 0.07);
    }
    
    .subscribe-btn {
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }
    
    .subscribe-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
      .footer {
        padding: 3rem 0 2rem;
      }
      
      .footer-col {
        margin-bottom: 2rem;
      }
    }
  `;

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 footer-col">
              <div className="footer-brand">ShopIt WearIt</div>
              <p className="footer-paragraph mb-4">
                Elevating your style with premium quality clothing and accessories.
                Discover the perfect blend of comfort, fashion, and sustainability.
              </p>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-6 footer-col">
              <h5 className="footer-heading">Explore</h5>
              <div className="footer-links">
                <Link 
                onClick={() => {
                  // This ensures immediate scroll to top when clicking the link
                  window.scrollTo(0, 0);
                }}
                to="/" className="footer-link">
                  <i className="fas fa-chevron-right"></i> Home
                </Link>
                <Link 
                onClick={() => {
                  // This ensures immediate scroll to top when clicking the link
                  window.scrollTo(0, 0);
                }}
                to="/product" className="footer-link">
                  <i className="fas fa-chevron-right"></i> Products
                </Link>
                <Link 
                onClick={() => {
                  // This ensures immediate scroll to top when clicking the link
                  window.scrollTo(0, 0);
                }}
                to="/about" className="footer-link">
                  <i className="fas fa-chevron-right"></i> About Us
                </Link>
                <Link 
                onClick={() => {
                  // This ensures immediate scroll to top when clicking the link
                  window.scrollTo(0, 0);
                }}
                to="/contact" className="footer-link">
                  <i className="fas fa-chevron-right"></i> Contact
                </Link>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 footer-col">
              <h5 className="footer-heading">Quick Links</h5>
              <div className="footer-links">
                <Link to="/privacy" className="footer-link">
                  <i className="fas fa-chevron-right"></i> Privacy Policy
                </Link>
                <Link to="/terms" className="footer-link">
                  <i className="fas fa-chevron-right"></i> Terms of Service
                </Link>
                <Link to="/shipping" className="footer-link">
                  <i className="fas fa-chevron-right"></i> Shipping Info
                </Link>
                <Link to="/faq" className="footer-link">
                  <i className="fas fa-chevron-right"></i> FAQ
                </Link>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 footer-col">
              <h5 className="footer-heading">Stay Updated</h5>
              <p className="footer-paragraph mb-3">
                Subscribe to our newsletter for the latest updates and exclusive offers.
              </p>
              <div>
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email"
                />
                <button className="subscribe-btn">Subscribe</button>
              </div>
            </div>
          </div>
          
          <div className="copyright">
            <p className="mb-2">
              Designed with <i className="fas fa-heart" style={{ color: "#ec4899" }}></i> by{" "}
              <span className="creator-text">Mehdi, Ahmar, Yasser</span>
            </p>
            <p className="mb-0">
              © {new Date().getFullYear()} ShopIt WearIt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;