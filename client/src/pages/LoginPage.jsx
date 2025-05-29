import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { FaSignInAlt } from 'react-icons/fa';
import '../components/Auth/AuthForms.css';

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <FaSignInAlt />
            </div>
            <h1 className="auth-form-title">Welcome Back</h1>
            <p className="auth-form-subtitle">
              Sign in to your account to continue
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;