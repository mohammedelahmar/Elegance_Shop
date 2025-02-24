import React from "react";

const Footer = () => {
  const footerStyles = `
    .footer-gradient {
      background: linear-gradient(145deg, #2c3e50, #3498db);
      color: rgba(255,255,255,0.8);
      padding: 4rem 0 2rem;
      margin-top: auto;
    }
    
    .footer-heading {
      color: #f1c40f;
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .footer-link {
      color: rgba(255,255,255,0.7) !important;
      text-decoration: none;
      transition: all 0.3s ease;
      padding: 5px 0;
      display: inline-block;
    }
    
    .footer-link:hover {
      color: #f1c40f !important;
      transform: translateX(5px);
    }
    
    .social-icons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    }
    
    .social-icon {
      font-size: 1.5rem;
      color: rgba(255,255,255,0.7);
      transition: all 0.3s ease;
    }
    
    .social-icon:hover {
      color: #f1c40f;
      transform: translateY(-3px);
    }
    
    .creator-text {
      background: linear-gradient(45deg, #fff, #f1c40f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 600;
      letter-spacing: 1px;
    }
    
    .copyright {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 1.5rem;
      margin-top: 3rem;
      text-align: center;
    }
  `;

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="footer-gradient">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h5 className="footer-heading">About Us</h5>
              <p className="mb-4">
                Bringing you the best products with quality and style. 
                Your satisfaction is our ultimate goal.
              </p>
            </div>
            
            <div className="col-md-4">
              <h5 className="footer-heading">Quick Links</h5>
              <div className="d-flex flex-column">
                <a href="/about" className="footer-link">About</a>
                <a href="/contact" className="footer-link">Contact</a>
                <a href="/privacy" className="footer-link">Privacy Policy</a>
                <a href="/terms" className="footer-link">Terms of Service</a>
              </div>
            </div>
            
            <div className="col-md-4">
              <h5 className="footer-heading">Follow Us</h5>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="copyright">
            <p className="mb-0">
              Made with ❤️ by{" "}
              <span className="creator-text">Mehdi, Ahmar, Yasser</span>
            </p>
            <p className="mb-0 mt-2">
              © {new Date().getFullYear()} Srbi mab9ach. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;