import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaRegStar, FaArrowRight, FaEnvelope } from 'react-icons/fa';
import LoadingAnimation from '../components/common/LoadingAnimation';

import './HomePage.css'; // Ensure CSS is imported

const HomePage = () => {
  const { isAuthenticated, currentUser, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Force dark background on mount
    document.body.classList.add('dark-theme');
    
    // Simulate loading time for data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    return () => {
      clearTimeout(timer);
      animatedElements.forEach(el => observer.unobserve(el));
      // Clean up when component unmounts
      document.body.classList.remove('dark-theme');
    };
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5" style={{minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <LoadingAnimation size="large" text="Loading the latest fashion..." />
      </Container>
    );
  }

  const featuredProducts = [
    {
      id: 1,
      name: "Designer Denim Jacket",
      description: "Premium quality distressed denim jacket",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1604644401898-ebc523fd92d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      sizes: ['S', 'M', 'L', 'XL'],
      discount: "20%"
    },
    {
      id: 2,
      name: "Silk Evening Dress",
      description: "Elegant floor-length evening gown",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      sizes: ['XS', 'S', 'M']
    },
    {
      id: 3,
      name: "Premium Cotton Tees",
      description: "Pack of 3 organic cotton t-shirts",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      discount: "15%"
    },
    {
      id: 4,
      name: "Leather Ankle Boots",
      description: "Italian genuine leather boots",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1549298916-f52d724204b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      sizes: ['EU 38', 'EU 40', 'EU 42']
    }
  ];

  const categories = [
    { name: "Women's", icon: "👚", color: "#FF6B6B", image: "womens-category.jpg" },
    { name: "Men's", icon: "👔", color: "#4ECDC4", image: "mens-category.jpg" },
    { name: "Accessories", icon: "🕶️", color: "#FFD166", image: "accessories-category.jpg" },
    { name: "Footwear", icon: "👢", color: "#118AB2", image: "footwear-category.jpg" },
  ];

  const testimonials = [
    { 
      name: "Emma R.", 
      text: "The perfect fit! I've never found such quality fabrics in online shopping before.", 
      rating: 5,
      photo: "emma-testimonial.jpg"
    },
    { 
      name: "James P.", 
      text: "Fast shipping and excellent customer service. The leather jacket exceeded my expectations!", 
      rating: 5,
      photo: "james-testimonial.jpg"
    },
    { 
      name: "Sophia M.", 
      text: "Great selection of seasonal styles. My go-to fashion destination!", 
      rating: 5,
      photo: "sophia-testimonial.jpg"
    }
  ];

  return (
    <div className="dark-theme">
      {/* Fashion Hero Section */}
      <div className="hero-section text-white">
        <div className="hero-overlay"></div>
        <Container className="position-relative hero-content">
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <div className="text-center fade-in">
                <h1 className="hero-title">New Season Collection</h1>
                <p className="hero-subtitle mt-3">
                  Discover curated luxury fashion with sustainable ethics
                </p>
                <div className="mt-5 fade-in" style={{ animationDelay: "0.5s" }}>
                  <Button as={Link} to="/collection/spring" size="lg" className="hero-button me-3">
                    Spring Collection <FaArrowRight className="ms-2" />
                  </Button> 
                  <Button as={Link} to="/sale" variant="outline-light" size="lg" className="hero-button-outline">
                    Summer Sale
                  </Button>
                </div>
                <br />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* Welcome Message for Logged In Users */}
      {isAuthenticated && (
        <div className="welcome-banner">
          <Container>
            <Row className="align-items-center">
              <Col>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="mb-0">Welcome back, {currentUser?.Firstname}!</h4>
                    <p className="text-muted mb-0">Your personalized style recommendations are ready</p>
                  </div>
                  <div>
                    <Button as={Link} to="/profile" variant="outline-dark" className="me-2" style={{ marginRight: '0.6rem' }}>
                      Style Profile
                    </Button>
                    {isAdmin && (
                      <Button as={Link} to="/admin/dashboard" variant="outline-success">
                        Admin Dashboard
                      </Button>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {/* Featured Collection Section */}
      <section className="featured-products py-5">
        <Container>
          <div className="section-header text-center mb-5 slide-up">
            <h6 className="text-primary text-uppercase fw-bold">Spring Collection</h6>
            <h2 className="section-title">Trending Now</h2>
            <div className="section-divider"></div>
            <p className="text-muted">Explore our most coveted pieces this season</p>
          </div>
          
          <Row>
            {featuredProducts.map((product, index) => (
              <Col lg={3} md={6} key={product.id} className="mb-4">
                <div className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Card className="product-card h-100">
                    <div className="product-img-wrapper">
                      <Card.Img variant="top" src={product.image} className="product-img" />
                      {product.discount && (
                        <Badge bg="dark" className="product-discount">{product.discount} OFF</Badge>
                      )}
                      <div className="product-overlay">
                        <Button variant="light" className="rounded-circle product-btn">
                          <FaShoppingCart />
                        </Button>
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title className="product-title">{product.name}</Card.Title>
                      <div className="product-rating mb-2">
                        {[...Array(5)].map((_, i) => (
                          i < Math.floor(product.rating) ? 
                          <FaStar key={i} className="text-warning" /> : 
                          <FaRegStar key={i} className="text-warning" />
                        ))}
                        <span className="ms-2 text-muted small">{product.rating}</span>
                      </div>
                      <div className="product-sizes mb-3">
                        {product.sizes?.map(size => (
                          <span key={size} className="size-pill">{size}</span>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="product-price">${product.price}</span>
                        <Button variant="dark" size="sm" as={Link} to={`/products/${product.id}`}>
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
          
          <div className="text-center mt-4">
            <Button as={Link} to="/collection" variant="outline-dark" size="lg" className="view-all-btn">
              View Full Collection <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>
      
      {/* Style Categories Section */}
      <section className="categories-section py-5">
        <Container>
          <div className="section-header text-center mb-5 slide-up">
            <h6 className="text-primary text-uppercase fw-bold">Shop By Style</h6>
            <h2 className="section-title">Curated Collections</h2>
            <div className="section-divider"></div>
          </div>
          
          <Row className="g-4">
            {categories.map((category, index) => (
              <Col md={3} sm={6} key={index}>
                <div className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Link to={`/category/${category.name.toLowerCase()}`} className="text-decoration-none">
                    <div className="category-card" style={{backgroundImage: `url(${category.image})`}}>
                      <div className="category-content">
                        <div className="category-icon">{category.icon}</div>
                        <h4 className="category-name">{category.name}</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials-section py-5">
        <Container>
          <div className="section-header text-center mb-5 slide-up">
            <h6 className="text-primary text-uppercase fw-bold">Testimonials</h6>
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="section-divider"></div>
          </div>
          
          <Row className="justify-content-center">
            {testimonials.map((item, index) => (
              <Col md={4} key={index}>
                <div className="fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="testimonial-card">
                    <div className="testimonial-rating mb-3">
                      {[...Array(5)].map((_, i) => (
                        i < item.rating ? 
                        <FaStar key={i} className="text-warning" /> : 
                        <FaRegStar key={i} className="text-warning" />
                      ))}
                    </div>
                    <p className="testimonial-text">"{item.text}"</p>
                    <div className="testimonial-author mt-3">— {item.name}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* Newsletter Section */}
      <section className="newsletter-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="newsletter-container fade-in">
                <div className="newsletter-content text-center">
                  <FaEnvelope className="newsletter-icon" />
                  <h3>Subscribe to Our Newsletter</h3>
                  <p>Get the latest updates on new products and special sales</p>
                  
                  <div className="newsletter-form mt-4">
                    <div className="input-group" style={{ backgroundColor: 'rgb(33, 43, 62)', borderRadius: '2rem' }}>
                      <input type="email" className="form-control" placeholder="Your email address" />
                      <Button variant="primary">Subscribe</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {!isAuthenticated && (
        <div className="signup-banner py-5" >
          <Container>
            <Row className="align-items-center">
              <Col md={7}>
                <h3>Join Our Community Today</h3>
                <p className="mb-md-0">Create an account to get personalized recommendations and special offers</p>
              </Col>
              <Col md={5} className="text-md-end">
                <Button as={Link} to="/login" variant="primary" className="me-3">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="outline-primary">
                  Register
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
};

export default HomePage;