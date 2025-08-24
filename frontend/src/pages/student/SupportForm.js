import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Alert, Spinner } from "react-bootstrap";
import "./SupportForm.css";
import "./SupportFormResponsive.css";

const SupportForm = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    contactNumber: "",
    issue: "",
    photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Check for token when component mounts
    const token = localStorage.getItem('token');
    if (!token) {
      setError("You must be logged in to submit a support request");
      scrollToError();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onDrop = (acceptedFiles) => {
    setFormData({ ...formData, photo: acceptedFiles[0] });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });
  const validateForm = () => {
    const { studentName, email, contactNumber, issue } = formData;

    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|lk)$/;
    const contactRegex = /^\d{10}$/;

    if (!nameRegex.test(studentName)) {
      setError("Student Name must not contain special characters.");
      scrollToError();
      return false;
    }

    if (!emailRegex.test(email)) {
      setError("Email must be valid and end with .com or .lk");
      scrollToError();
      return false;
    }

    if (!contactRegex.test(contactNumber)) {
      setError("Contact Number must be exactly 10 digits.");
      scrollToError();
      return false;
    }

    const wordCount = issue.trim().split(/\s+/).length;
    if (wordCount > 500) {
      setError("Issue description must not exceed 500 words.");
      scrollToError();
      return false;
    }

    return true;
  };

  const scrollToError = () => {
    setTimeout(() => {
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // short delay to ensure Alert is rendered
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("You must be logged in to submit a support request");
        setIsSubmitting(false);
        scrollToError();
        return;
      }
      
      const response = await axios.post(
        "http://localhost:5000/api/student/support",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Simulate real-world network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (response.data) {
        // Use try-catch to handle any navigation errors
        try {
          navigate("/student/successfully-request", {
            state: {
              studentName: formData.studentName,
              requestId: response.data.data._id,
            },
          });
        } catch (navError) {
          console.error("Navigation error:", navError);
          // Fallback to public route if student route fails
          navigate("/successfully-request", {
            state: {
              studentName: formData.studentName,
              requestId: response.data.data._id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error submitting support request:", error);
      
      // Provide more specific error messages based on error type
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
      
      scrollToError();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <div className="loading-overlay">
          <Spinner
            animation="border"
            variant="primary"
            className="loading-spinner"
            role="status"
          />
          <div className="loading-text">Submitting your request...</div>
        </div>
      )}{" "}
      <div className="support-form-container">
        <h2 className="support-form-title">Submit Support Request</h2>
        <p className="required-fields-note">
          Fields marked with <span className="required-field">*</span> are
          required
        </p>

        {error && (
          <Alert
            ref={errorRef}
            variant="danger"
            onClose={() => setError("")}
            dismissible
          >
            {error}
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className="support-form"
          encType="multipart/form-data"
        >
          {" "}
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  id="studentName"
                  name="studentName"
                  className="form-control input-field"
                  placeholder=" "
                  onChange={handleChange}
                  value={formData.studentName}
                  disabled={isSubmitting}
                  required
                />
                <label htmlFor="studentName" className="floating-label">
                  Student Name <span className="required-field">*</span>
                </label>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control input-field"
                  placeholder=" "
                  onChange={handleChange}
                  value={formData.email}
                  disabled={isSubmitting}
                  required
                />
                <label htmlFor="email" className="floating-label">
                  Email <span className="required-field">*</span>
                </label>
              </div>
            </div>{" "}
          </div>{" "}
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  id="contactNumber"
                  name="contactNumber"
                  className="form-control input-field"
                  placeholder=" "
                  onChange={handleChange}
                  value={formData.contactNumber}
                  disabled={isSubmitting}
                  required
                />
                <label htmlFor="contactNumber" className="floating-label">
                  Contact Number <span className="required-field">*</span>
                </label>{" "}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="form-floating">
              <textarea
                id="issue"
                name="issue"
                className="form-control input-field"
                placeholder=" "
                onChange={handleChange}
                value={formData.issue}
                disabled={isSubmitting}
                style={{ height: "120px" }}
                required
              ></textarea>
              <label htmlFor="issue" className="floating-label">
                What's the issue? <span className="required-field">*</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Upload Image (Optional)</label>
            <div
              {...getRootProps()}
              className={`dropzone-area ${isSubmitting ? "disabled" : ""}`}
            >
              <input {...getInputProps()} disabled={isSubmitting} />
              {isDragActive ? (
                <p>Drop the image here ...</p>
              ) : formData.photo ? (
                <p>{formData.photo.name}</p>
              ) : (
                <p>Drag & drop an image here, or click to choose one</p>
              )}
            </div>
          </div>
          <div className="submit-button-container">
            <button
              className="btn submit-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SupportForm;
