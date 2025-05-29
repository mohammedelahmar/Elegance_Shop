import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../api/auth';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { FaLock } from 'react-icons/fa';
import '../components/Auth/AuthForms.css';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      setError('');
      
      await resetPasswordApi(token, password);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <FaLock />
            </div>
            <h1 className="auth-form-title">Reset Password</h1>
            <p className="auth-form-subtitle">
              {success ? 'Password reset successful!' : 'Enter your new password'}
            </p>
          </div>
          
          <div className="auth-form">
            {success ? (
              <Alert variant="success" className="auth-alert alert-success">
                Your password has been reset successfully! Redirecting to login...
              </Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="danger" className="auth-alert alert-danger">
                    {error}
                  </Alert>
                )}
                
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="auth-input"
                />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  className="auth-input"
                />
                
                <Button 
                  type="submit" 
                  className="auth-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="auth-loading">
                      <span className="auth-spinner"></span>
                      Setting New Password...
                    </div>
                  ) : (
                    <>
                      <FaLock className="me-2" />
                      Reset Password
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;