import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function InstructorSupportDesk() {
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const handleSupportClick = () => {
    navigate("/instructor/support-request");
  };

  const handleViewRequestsClick = () => {
    navigate("/instructor/support-list");
  };

  const handleAdminClick = () => {
    setShowAdminModal(true);
  };

  const handleAdminAccess = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setShowAdminModal(false);
      setAdminPassword("");
      setErrorMessage("");
      navigate("/admin/support");
    } else {
      setErrorMessage("Invalid password");
    }
  };

  return (
    <>
      <style>{`
        .support-desk-container {
          max-width: 900px;
          margin: 60px auto;
          padding: 40px;
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .support-desk-title {
          font-size: 2.75rem;
          font-weight: 700;
          color: #1a237e;
          margin-bottom: 20px;
          text-align: center;
        }
        .support-desk-description {
          font-size: 1.15rem;
          color: #444;
          line-height: 1.7;
          margin-bottom: 35px;
          text-align: center;
        }
        .support-desk-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }
        .support-desk-buttons .btn {
          min-width: 200px;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.3s ease-in-out;
        }
        .support-desk-buttons .submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: auto;
          min-width: 150px;
          padding: 10px 24px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
          background-color: #8BC34A !important;
          border-color: #8BC34A !important;
          color: white !important;
        }
        .support-desk-buttons .submit-btn:hover,
        .support-desk-buttons .submit-btn:focus,
        .support-desk-buttons .submit-btn:active {
          background-color: #3E9355 !important;
          border-color: #3E9355 !important;
          box-shadow: 0 4px 8px rgba(62, 147, 85, 0.2);
          transform: translateY(-1px);
        }
        .support-desk-buttons .submit-btn:disabled {
          background-color: #cccccc !important;
          border-color: #cccccc !important;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .support-desk-buttons .btn-outline-dark {
          color: #333;
          border-color: #333;
          background-color: transparent;
        }
        .support-desk-buttons .btn-outline-dark:hover {
          background-color: #333;
          color: white;
        }
        .modal-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        .modal-title {
          color: #333;
          font-weight: 600;
        }
        .modal-body .btn-primary {
          background-color: #8BC34A;
          border-color: #8BC34A;
        }
        .modal-body .btn-primary:hover {
          background-color: #3E9355;
          border-color: #3E9355;
        }
        @media (max-width: 576px) {
          .support-desk-container {
            padding: 30px 20px;
          }
          .support-desk-title {
            font-size: 2rem;
          }
          .support-desk-description {
            font-size: 1rem;
          }
          .support-desk-buttons {
            flex-direction: column;
            align-items: center;
          }
          .support-desk-buttons .btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div className="support-desk-container">
        <h1 className="support-desk-title">Welcome to the Instructor Support Desk</h1>
        <p className="support-desk-description">
          The Instructor Support Desk is here to assist you with any academic,
          technical, or administrative issues you may encounter. Whether you're
          facing difficulties with course materials, need IT help, or want to
          raise concerns, we're here to support you. Submit a request and our
          support team will respond promptly.
        </p>

        <div className="support-desk-buttons">
          <Button className="submit-btn" onClick={handleSupportClick}>
            Submit a Support Request
          </Button>
          <Button className="submit-btn" onClick={handleViewRequestsClick}>
            View Your Requests
          </Button>
        </div>
      </div>

      <Modal
        show={showAdminModal}
        onHide={() => setShowAdminModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Admin Access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdminAccess}>
            <Form.Group className="mb-3">
              <Form.Label>Enter Admin Password</Form.Label>
              <Form.Control
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Password"
                required
              />
              {errorMessage && (
                <div className="text-danger mt-2">{errorMessage}</div>
              )}
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowAdminModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                style={{ backgroundColor: "#8BC34A", borderColor: "#8BC34A" }}
              >
                Login
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default InstructorSupportDesk;
