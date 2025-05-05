import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import './HomePage.css';

const initialForm = { name: '', email: '', message: '' };

const ContactPage = () => {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <div className="dark-theme">
      {/* Hero Section */}
      <div
        className="hero-section text-white contact-hero-section"
        style={{
          minHeight: '40vh',
          position: 'relative',
        }}
      >
        <div className="hero-overlay" style={{background: 'rgba(22,28,45,0.7)', position: 'absolute', top:0, left:0, width:'100%', height:'100%', zIndex:1}}></div>
        <Container className="position-relative hero-content" style={{zIndex:2}}>
          <Row className="justify-content-center">
            <Col md={10} lg={8} className="text-center fade-in">
              <h1 className="hero-title">Contact Us</h1>
              <p className="hero-subtitle mt-3">
                We're here to help! Reach out for support, feedback, or just to say hello.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contact Info & Form */}
      <section className="featured-products py-5">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col md={4} className="mb-4 fade-in">
              <Card className="product-card text-center p-4 h-100">
                <FaEnvelope className="mb-3" style={{ fontSize: '2rem', color: '#4a6bf5' }} />
                <h5>Email</h5>
                <p className="text-muted mb-0">support@eleganceshop.com</p>
              </Card>
            </Col>
            <Col md={4} className="mb-4 fade-in">
              <Card className="product-card text-center p-4 h-100">
                <FaPhone className="mb-3" style={{ fontSize: '2rem', color: '#4a6bf5' }} />
                <h5>Phone</h5>
                <p className="text-muted mb-0">+212 600-000-000</p>
              </Card>
            </Col>
            <Col md={4} className="mb-4 fade-in">
              <Card className="product-card text-center p-4 h-100">
                <FaMapMarkerAlt className="mb-3" style={{ fontSize: '2rem', color: '#4a6bf5' }} />
                <h5>Location</h5>
                <p className="text-muted mb-0">Casablanca, Morocco</p>
              </Card>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="newsletter-container p-4">
                <h3 className="mb-4 text-center">Send Us a Message</h3>
                {submitted && (
                  <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
                    Thank you for contacting us! We'll get back to you soon.
                  </Alert>
                )}
                {error && (
                  <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="contactName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your Name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="contactEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Your Email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="contactMessage" className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Type your message here..."
                    />
                  </Form.Group>
                  <div className="text-center">
                    <Button type="submit" size="lg" className="hero-button">
                      Send Message <FaPaperPlane className="ms-2" />
                    </Button>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ContactPage;
