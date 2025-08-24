import React, { useState } from 'react';
import './EnterCode.css';
import { useNavigate } from 'react-router-dom';

function EnterCode() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState(sessionStorage.getItem('email') || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('OTP verified:', data);
        navigate('/changepassword');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div className="enter-code-container">
      <div className="enter-code-form-wrapper">
        <h2 className="enter-code-title">Enter Your Code</h2>
        <h3 className="enter-code-subtitle">
          Enter the code from the email<br />
          We just sent you.
        </h3>
        <form onSubmit={handleSubmit} className="enter-code-form">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="enter-email-input"
            required
            readOnly
          />
          <input
            type="text"
            placeholder="Enter Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="enter-code-input"
            required
          />
          <button type="submit" className="enter-code-button">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default EnterCode;