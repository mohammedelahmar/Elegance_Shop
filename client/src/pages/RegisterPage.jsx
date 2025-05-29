import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
import { FaUserPlus } from 'react-icons/fa';
import '../components/Auth/AuthForms.css';

const RegisterPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <FaUserPlus />
            </div>
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-subtitle">
              Join us and start your journey today
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;