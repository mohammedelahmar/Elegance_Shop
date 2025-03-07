import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setMessage(data.message || (response.ok ? 'Login successful!' : 'Login failed'));
      
      if (response.ok) {
        console.log('User login:', data);
        // Redirect logic here
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    }
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
                  <h2 className="fw-bold text-gradient-primary">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label text-secondary mb-2">
                      <FaEnvelope className="me-2" />
                      Email Address
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        className="form-control form-control-lg border-end-0"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          borderLeft: 'none',
                          borderRadius: '0.375rem'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-secondary mb-2">
                      <FaLock className="me-2" />
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                      />
                      <label className="form-check-label text-secondary" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none text-primary">
                      Forgot Password?
                    </Link>
                  </div>

                  <button 
                    className="btn btn-primary btn-lg w-100 mb-3" 
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => e.target.style.opacity = '0.9'}
                    onMouseOut={e => e.target.style.opacity = '1'}
                  >
                    <FaSignInAlt className="me-2" />
                    Sign In
                  </button>

                  {message && (
                    <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mt-3`}>
                      {message}
                    </div>
                  )}

                  <div className="text-center mt-4">
                    <span className="text-muted">Don't have an account? </span>
                    <Link 
                      to="/register" 
                      className="text-decoration-none text-primary fw-semibold"
                    >
                      Create Account
                    </Link>
                  </div>
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

export default Login;