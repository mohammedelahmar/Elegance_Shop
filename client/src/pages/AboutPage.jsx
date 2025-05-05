import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUsers, FaRocket, FaHeart, FaStar, FaRegStar, FaTrophy } from 'react-icons/fa';
import './HomePage.css';

const TEAM = [
  { name: 'Mohammed Mehdi Boudir', role: 'Frontend Developer', img: '', icon: <FaRocket /> },
  { name: 'Mohammed El Ahmar', role: 'Backend Developer', img: '', icon: <FaTrophy /> },
  { name: 'Yasser Amiri', role: 'Rapport Maker', img: '', icon: <FaHeart /> },
];

const AboutPage = () => {
  return (
    <div className="dark-theme">
      {/* Hero Section */}
      <div
        className="hero-section text-white about-hero-section"
        style={{
          minHeight: '60vh',
          position: 'relative',
        }}
      >
        <div className="hero-overlay" style={{background: 'rgba(22,28,45,0.7)', position: 'absolute', top:0, left:0, width:'100%', height:'100%', zIndex:1}}></div>
        <Container className="position-relative hero-content" style={{zIndex:2}}>
          <Row className="justify-content-center">
            <Col md={10} lg={8} className="text-center fade-in">
              <h1 className="hero-title">About Elegance Shop</h1>
              <p className="hero-subtitle mt-3">
                Elevate Your Style, Embrace Elegance. Discover our story, mission, and the passionate team behind your favorite online fashion destination.
              </p>
              <div className="mt-5 fade-in" style={{ animationDelay: '0.5s' }}>
                <Button href="#team" size="lg" className="hero-button me-3">
                  Meet the Team <FaUsers className="ms-2" />
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Mission Section */}
      <section className="featured-products py-5">
        <Container>
          <div className="section-header text-center mb-5 slide-up">
            <h6 className="text-primary text-uppercase fw-bold">Our Mission</h6>
            <h2 className="section-title">Why We Exist</h2>
            <div className="section-divider"></div>
            <p className="text-muted">To deliver exceptional shopping experiences with curated collections that blend style, quality, and affordability.</p>
          </div>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <Card className="product-card p-4 mb-4">
                <Card.Body>
                  <h4 className="mb-3">Fashion with Purpose</h4>
                  <p className="text-muted mb-0">
                    We believe fashion should empower everyone. Our platform brings together the latest trends, sustainable practices, and a seamless shopping journey. We are committed to quality, transparency, and customer happiness.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="categories-section py-5" id="team">
        <Container>
          <div className="section-header text-center mb-5 slide-up">
            <h6 className="text-primary text-uppercase fw-bold">Our Team</h6>
            <h2 className="section-title">Meet the Creators</h2>
            <div className="section-divider"></div>
          </div>
          <Row className="g-4 justify-content-center">
            {TEAM.map((member, idx) => (
              <Col md={4} sm={6} key={idx} className="fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <Card className="category-card text-center p-4 h-100">
                  <div className="category-icon mb-3" style={{ fontSize: '2.5rem' }}>{member.icon}</div>
                  <h4 className="category-name mb-2" style={{color:'#5d7afa'}}>{member.name}</h4>
                  <p className="text-muted mb-0" style={{color:'#1e2852'}}>{member.role}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5">
        <Container>
          <div className="section-header text-center mb-5 slide-up">
            <h6 className="text-primary text-uppercase fw-bold">What Drives Us</h6>
            <h2 className="section-title">Our Values</h2>
            <div className="section-divider"></div>
          </div>
          <Row className="justify-content-center">
            <Col md={4} className="fade-in">
              <div className="testimonial-card">
                <div className="testimonial-rating mb-3">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="text-warning" />)}
                </div>
                <p className="testimonial-text">"We put our customers first, always. Your satisfaction is our top priority."</p>
                <div className="testimonial-author mt-3">— Elegance Shop Team</div>
              </div>
            </Col>
            <Col md={4} className="fade-in">
              <div className="testimonial-card">
                <div className="testimonial-rating mb-3">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="text-warning" />)}
                </div>
                <p className="testimonial-text">"Sustainability and style go hand in hand. We strive for a better, greener future."</p>
                <div className="testimonial-author mt-3">— The Founders</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
