import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signUp } from "../../utils/authService";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Notification from "../../components/Notification";
import "./Auth.css";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setNotification({
        message: "All fields are required",
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setNotification({
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    if (formData.password.length < 6) {
      setNotification({
        message: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setNotification({
        message: "Registration successful! Please sign in.",
        type: "success",
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      setNotification({
        message: err.message || "Signup failed. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (response) => {
    try {
      const token = response.credential;
      // Handle Google sign-in logic here
      setNotification({
        message: "Google sign-in successful! Redirecting...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/student/dashboard");
      }, 1500);
    } catch (err) {
      setNotification({
        message: "Google sign-in failed",
        type: "error",
      });
    }
  };

  return (
    <div className="auth-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="auth-form-container">
        <h2 className="auth-heading">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="auth-input"
              required
            />
          </div>

          <div className="auth-input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              className="auth-input"
              required
            />
          </div>

          <div className="auth-input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              className="auth-input"
              required
              minLength="6"
            />
          </div>

          <div className="auth-input-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="auth-input"
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <GoogleOAuthProvider clientId="982367877621-6pphdficbquj0mk3b73rmrluj1g70bb9.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() =>
                setNotification({
                  message: "Google sign-in failed",
                  type: "error",
                })
              }
              useOneTap
            />
          </GoogleOAuthProvider>

          <p className="auth-switch">
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
