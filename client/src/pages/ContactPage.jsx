import React from "react";
import { Footer, Navbar } from "../components";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";

const ContactPage = () => {
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    setMessage("Message sent successfully!");
  };

  return (
    <>
      <Navbar />
      <div className="container min-vh-100 d-flex flex-column justify-content-center py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg rounded-3 border-0">
              <div className="card-body p-4 p-sm-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-gradient-primary">Contact Us</h2>
                  <p className="text-muted">We'd love to hear from you</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label text-secondary mb-2">
                      <FaUser className="me-2" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-secondary mb-2">
                      <FaEnvelope className="me-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="name@example.com"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-secondary mb-2">
                      <FaCommentDots className="me-2" />
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="form-control form-control-lg"
                      placeholder="Enter your message..."
                      required
                    />
                  </div>

                  <button 
                    className="btn btn-primary btn-lg w-100" 
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => e.target.style.opacity = '0.9'}
                    onMouseOut={e => e.target.style.opacity = '1'}
                  >
                    Send Message
                  </button>

                  {message && (
                    <div className="alert alert-success mt-4">
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;