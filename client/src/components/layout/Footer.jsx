import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane } from 'react-icons/fa';
import Input from '../UI/Input';
import Button from '../UI/Button';

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribeLoading(true);
    
    // Simulate API call for newsletter subscription
    setTimeout(() => {
      console.log('Subscribed with email:', email);
      setEmail('');
      setSubscribeLoading(false);
    }, 1000);
  };
  
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row className="py-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5>About Us</h5>
            <p className="text-muted">
              We provide high-quality products at competitive prices. 
              Our mission is to deliver exceptional shopping experiences.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light fs-5"><FaFacebook /></a>
              <a href="#" className="text-light fs-5"><FaTwitter /></a>
              <a href="#" className="text-light fs-5"><FaInstagram /></a>
              <a href="#" className="text-light fs-5"><FaLinkedin /></a>
            </div>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-muted text-decoration-none">Products</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none">About</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none">Contact</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <h5>Account</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/profile" className="text-muted text-decoration-none">My Account</Link>
              </li>
              <li className="mb-2">
                <Link to="/orders" className="text-muted text-decoration-none">Orders</Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-muted text-decoration-none">Cart</Link>
              </li>
              <li className="mb-2">
                <Link to="/wishlist" className="text-muted text-decoration-none">Wishlist</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5>Newsletter</h5>
            <p className="text-muted">Subscribe for updates on new products and special offers.</p>
            <Form onSubmit={handleSubscribe} className="d-flex">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="me-2"
              />
              <Button 
                type="submit" 
                icon={FaPaperPlane} 
                isLoading={subscribeLoading}
                variant="primary"
              >
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>
        
        <hr className="mt-2 mb-3" />
        
        <Row>
          <Col className="text-center text-muted">
            <p className="mb-0">© {year} My E-Shop. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;