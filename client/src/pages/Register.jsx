import React, { useState } from 'react';
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome, FaVenusMars, FaCheck } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    Firstname: '', 
    Lastname: '',  
    sexe: '',
    email: '',
    password: '',
    phone_number: '',
    address: ''
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Save user data and token
      login(data);
      
      // Show success message briefly
      setMessage('Registration successful! Redirecting...');
      
      // Redirect to home page
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container min-vh-100 d-flex flex-column justify-content-center py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="card shadow-lg rounded-3 border-0">
              <div className="card-body p-4 p-sm-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-gradient-primary">Create Account</h2>
                  <p className="text-muted">Join our community today</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* First Name */}
                    <div className="col-md-6">
                      <label className="form-label text-secondary mb-2">
                        <FaUser className="me-2" />
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="Firstname"
                        placeholder="John"
                        value={formData.Firstname}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div className="col-md-6">
                      <label className="form-label text-secondary mb-2">
                        <FaUser className="me-2" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="Lastname"
                        placeholder="Doe"
                        value={formData.Lastname}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Gender Selection */}
                    <div className="col-12">
                      <label className="form-label text-secondary mb-2">
                        <FaVenusMars className="me-2" />
                        Gender
                      </label>
                      <div className="btn-group w-100 shadow-sm">
                        {['male', 'female'].map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            className={`btn btn-lg btn-outline-primary text-start d-flex align-items-center ${
                              formData.sexe === gender ? 'active' : ''
                            }`}
                            onClick={() => handleChange({ target: { name: 'sexe', value: gender }})}
                            style={{
                              flex: 1,
                              transition: 'all 0.3s ease',
                              borderColor: '#6366f1'
                            }}
                          >
                            {formData.sexe === gender && <FaCheck className="me-2" />}
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-12">
                      <label className="form-label text-secondary mb-2">
                        <FaEnvelope className="me-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="col-12">
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

                    {/* Phone Number */}
                    <div className="col-md-6">
                      <label className="form-label text-secondary mb-2">
                        <FaPhone className="me-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control form-control-lg"
                        name="phone_number"
                        placeholder="+1 234 567 890"
                        value={formData.phone_number}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Address */}
                    <div className="col-md-6">
                      <label className="form-label text-secondary mb-2">
                        <FaHome className="me-2" />
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="address"
                        placeholder="123 Main St"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    className="btn btn-primary btn-lg w-100 mt-4" 
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => e.target.style.opacity = '0.9'}
                    onMouseOut={e => e.target.style.opacity = '1'}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>

                  {/* Message Alert */}
                  {message && (
                    <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mt-4`}>
                      {message}
                    </div>
                  )}

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <span className="text-muted">Already have an account? </span>
                    <Link 
                      to="/login" 
                      className="text-decoration-none text-primary fw-semibold"
                    >
                      Sign In
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

export default Register;