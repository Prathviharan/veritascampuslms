import React, { useState } from "react";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Sign-in successful:", data);
        await fetch("http://localhost:5000/api/auth/save-signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form-container">
        <h2 className="signin-heading">Sign In</h2>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="signin-input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="signin-input"
              required
            />
          </div>
          <div className="signin-input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="signin-input"
              required
            />
          </div>
          <div className="signin-options">
            <a href="/forgotpassword" className="forgot-password-link">
              Forgot your password?
            </a>
          </div>
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
        {/* Sample Button can be placed here or elsewhere as needed */}
        {/* <button className="sample-button">Sample Button</button> */}
      </div>
    </div>
  );
}

export default SignIn;
