import React from 'react';
import { motion } from 'framer-motion';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import { FaKey } from 'react-icons/fa';
import '../components/Auth/AuthForms.css';

const ForgotPasswordPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="auth-page"
    >
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <FaKey />
            </div>
            <h1 className="auth-form-title">Forgot Password?</h1>
            <p className="auth-form-subtitle">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;