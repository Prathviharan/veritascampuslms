import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signIn } from "../../utils/authService";
import Notification from "../../components/Notification";
import { decodeToken } from "../../utils/decodeToken";
import "./Auth.css";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      setNotification({
        message: location.state.successMessage,
        type: "success",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token, role } = await signIn(formData);

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      const decoded = decodeToken(token);
      if (role === "student" && decoded.studentId) {
        localStorage.setItem("studentId", decoded.studentId);
      }

      setNotification({
        message: "Login successful! Redirecting...",
        type: "success",
      });

      setTimeout(() => {
        if (role === "student") {
          navigate("/student/dashboard");
        } else if (role === "instructor") {
          navigate("/instructor/dashboard");
        } else {
          navigate("/admin/dashboard");
        }
      }, 1500);
    } catch (err) {
      setNotification({
        message: err.message || "Login failed. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
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
        <h2 className="auth-heading">Sign In</h2>

        <form onSubmit={handleSubmit}>
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
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="auth-switch">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
