import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangeSuccessful.css'; 

const ChangeSuccessful = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    sessionStorage.removeItem('email'); // Remove email from session storage
    navigate('/signin');
  };

  return (
    <div className="change-successful-container">
      <div className="change-successful-box">
        <div className="change-successful-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="#55B649"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.07 0l5-5a.75.75 0 0 0-1.06-1.06L7.5 9.44 5.53 7.47a.75.75 0 0 0-1.06 1.06l2.5 2.5z"/>
          </svg>
        </div>
        <h2 className="change-successful-title">Change Successful!</h2>
        <p className="change-successful-message">Your changes have been saved successfully</p>
        <button className="change-successful-button" onClick={handleSignIn}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default ChangeSuccessful;
