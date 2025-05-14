import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowUp, FaCreditCard, FaLock, FaTruck, FaCheck } from 'react-icons/fa';
import Input from '../UI/Input';
import Button from '../UI/Button';
import './Footer.css';

// Constants for footer data
const SOCIAL_LINKS = [
  { icon: <FaFacebook />, url: '#', label: 'Facebook' },
  { icon: <FaTwitter />, url: '#', label: 'Twitter' },
  { icon: <FaInstagram />, url: '#', label: 'Instagram' },
  { icon: <FaLinkedin />, url: '#', label: 'LinkedIn' }
];

const TRUST_BADGES = [
  { icon: <FaTruck />, title: 'Free Shipping', description: 'On orders over $50' },
  { icon: <FaLock />, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: <FaCreditCard />, title: 'Multiple Payment Options', description: 'Credit cards, PayPal, and more' },
  { icon: <FaCheck />, title: 'Quality Guarantee', description: '30-day money-back guarantee' }
];

const QUICK_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact Us' },
  { path: '/faq', label: 'FAQ' }
];

const ACCOUNT_LINKS = [
  { path: '/profile', label: 'My Account' },
  { path: '/orders', label: 'Order History' },
  { path: '/cart', label: 'Shopping Cart' },
  { path: '/wishlist', label: 'Wishlist' },
  { path: '/track-order', label: 'Track Order' }
];

const FOOTER_BOTTOM_LINKS = [
  { path: '/privacy-policy', label: 'Privacy Policy' },
  { path: '/terms', label: 'Terms of Service' },
  { path: '/sitemap', label: 'Sitemap' }
];

const CONTACT_INFO = [
  { icon: <FaMapMarkerAlt />, text: 'Kenitra, Morocco' },
  { icon: <FaPhone />, text: '+212 682-480-268' },
  { icon: <FaEnvelope />, text: 'eleganceshop.sender@gmail.com' }
];

// Sub-components
const SocialIcon = ({ url, label, icon }) => (
  <a href={url} className="social-icon" aria-label={label}>
    {icon}
  </a>
);

const FooterLinks = ({ links }) => (
  <ul className="footer-links">
    {links.map((link, index) => (
      <li key={index}>
        <Link to={link.path}>{link.label}</Link>
      </li>
    ))}
  </ul>
);

const TrustBadge = ({ icon, title, description }) => (
  <div className="trust-item">
    <span className="trust-icon">{icon}</span>
    <div>
      <h6>{title}</h6>
      <p>{description}</p>
    </div>
  </div>
);

const ContactItem = ({ icon, text }) => (
  <div className="contact-item">
    <span className="contact-icon">{icon}</span>
    <span>{text}</span>
  </div>
);

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email) {
      setSubscribeError('Please enter your email');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setSubscribeError('Please enter a valid email');
      return;
    }
    
    setSubscribeError('');
    setSubscribeLoading(true);
    
    // Simulate API call for newsletter subscription
    setTimeout(() => {
      console.log('Subscribed with email:', email);
      setEmail('');
      setSubscribeLoading(false);
      setSubscribeSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubscribeSuccess(false), 3000);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="footer"role="contentinfo" >
      <div className="footer-top">
        <Container>
          <Row className="align-items-center py-4">
            <Col md={6} className="mb-4 mb-md-0">
              <div className="brand">
                <span className="brand-text">Elegance</span>
                <span className="brand-accent">Shop</span>
              </div>
              <p className="footer-slogan mt-2">Elevate Your Style, Embrace Elegance</p>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="social-icons">
                {SOCIAL_LINKS.map((social, index) => (
                  <SocialIcon key={index} {...social} />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Trust badges section */}
      <div className="trust-badges">
        <Container>
          <Row className="py-3 text-center">
            {TRUST_BADGES.map((badge, index) => (
              <Col key={index} lg={3} md={6} className={index < 3 ? "mb-3 mb-lg-0" : ""}>
                <TrustBadge {...badge} />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      
      <div className="footer-middle">
        <Container>
          <Row className="py-5">
            <Col lg={4} md={6} className="mb-4 mb-lg-0">
              <h5 className="footer-heading">About Us</h5>
              <p className="footer-text">
                We provide high-quality products at competitive prices. 
                Our mission is to deliver exceptional shopping experiences with 
                curated collections that blend style, quality, and affordability.
              </p>
              <div className="contact-info">
                {CONTACT_INFO.map((item, index) => (
                  <ContactItem key={index} {...item} />
                ))}
              </div>
            </Col>
            
            <Col lg={2} md={6} className="mb-4 mb-lg-0">
              <h5 className="footer-heading">Quick Links</h5>
              <FooterLinks links={QUICK_LINKS} />
            </Col>
            
            <Col lg={2} md={6} className="mb-4 mb-lg-0">
              <h5 className="footer-heading">Account</h5>
              <FooterLinks links={ACCOUNT_LINKS} />
            </Col>
            
            <Col lg={4} md={6}>
              <h5 className="footer-heading">Newsletter</h5>
              <p className="footer-text">
                Subscribe to receive updates on new collections, special offers and exclusive content.
              </p>
              <Form onSubmit={handleSubscribe} className="newsletter-form">
                <div className="input-group" >
                  <Input style={{width: '100%' , height: '100%'}}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="newsletter-input"
                    aria-label="Email for newsletter subscription"
                  />
                  <Button style={{ height: '100%'}}
                    type="submit" 
                    icon={FaPaperPlane} 
                    isLoading={subscribeLoading}
                    variant="primary"
                    className="newsletter-button"
                    aria-label="Subscribe to newsletter"
                  >
                    Subscribe
                  </Button>
                </div>
                {subscribeError && (
                  <div className="error-message mt-2" role="alert">
                    {subscribeError}
                  </div>
                )}
                {subscribeSuccess && (
                  <div className="success-message mt-2" role="status">
                    Thank you for subscribing!
                  </div>
                )}
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      
      <div className="footer-bottom">
        <Container>
          <Row className="py-3 align-items-center">
            <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
              <p className="copyright">
                © {year} Elegance Shop. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="footer-bottom-links">
                {FOOTER_BOTTOM_LINKS.map((link, index) => (
                  <Link key={index} to={link.path}>{link.label}</Link>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      {showBackToTop && (
        <button 
          className="back-to-top" 
          onClick={scrollToTop} 
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
};

export default Footer;