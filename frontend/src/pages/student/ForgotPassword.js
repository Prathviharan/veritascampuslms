import React, { useState } from 'react';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const checkEmailExists = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/check-user?email=${email}`);
      if (!response.ok) {
        alert('Email does not exist in the database');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailExists = await checkEmailExists();
    if (!emailExists) return;

    try {
      sessionStorage.setItem('email', email);
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('OTP sent:', data);
        navigate('/Entercode', { state: { email } });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-form-wrapper">
        <h2 className="forgot-title">Forgot Password?</h2>
        <h3 className="forgot-subtitle">
          Don't worry! Resetting your password is easy.<br />
          Just type in the email you registered to <b>Veritas International Campus</b>
        </h3>
        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-input"
            required

          />
          <button type="submit" className="forgot-button">Submit</button>
        </form>
        <p className="back-link" onClick={() => navigate('/signin')}>Back to Sign In</p>
      </div>
    </div>
  );
}

export default ForgotPassword;