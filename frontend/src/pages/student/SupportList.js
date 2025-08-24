// src/pages/student/SupportList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Alert,
  Spinner,
  Card,
  Row,
  Col,
  Badge,
  Container,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./SupportList.css"; // custom CSS file

const SupportList = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'replied'
  const [searchTerm, setSearchTerm] = useState("");
  
  // Debug function to check authentication
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("No authentication token found in localStorage");
        return;
      }
      
      const response = await axios.get(
        "http://localhost:5000/api/student/support/debug-auth", 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log("Auth debug response:", response.data);
      alert("Authentication check successful. See console for details.");
    } catch (error) {
      console.error("Auth debug error:", error);
      alert(`Authentication check failed: ${error.message}`);
    }
  };  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      console.log("Fetching support requests with isAdmin=false");
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log("No authentication token available - user needs to sign in");
        setError("Please sign in to view your support requests");
        setLoading(false);
        return;
      }
      
      let requestConfig = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000 // 10 second timeout
      };
      
      console.log("Using authentication token");
      
      let res;
      try {
        // Try the new simplified authenticated API endpoint for user's own requests
        res = await axios.get("http://localhost:5000/api/student/support/user", requestConfig);
        console.log("Support requests fetched from /user endpoint:", res.data);
      } catch (userEndpointError) {
        console.log("User endpoint failed, trying fixed endpoint:", userEndpointError.message);
        // Fallback to the fixed endpoint
        res = await axios.get("http://localhost:5000/api/student/support/fixed", requestConfig);
        console.log("Support requests fetched from /fixed endpoint:", res.data);
      }
      
      // Ensure we always set an array, even if the response is null or undefined
      setSupportRequests(Array.isArray(res.data) ? res.data : []);
      setError("");
      
    } catch (error) {
      console.error("Error fetching support requests:", error);
      
      if (error.response) {
        // Server responded with an error status
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 401) {
          // Authentication failed
          console.log("Authentication failed - token may be invalid");
          setError("Your session has expired. Please sign in again.");
          localStorage.removeItem('token'); // Clear invalid token
          localStorage.removeItem('userRole'); // Clear user role as well
        } else if (status === 403) {
          setError("You don't have permission to view support requests.");
        } else if (status === 404) {
          // No support requests found, this is not an error
          console.log("No support requests found");
          setSupportRequests([]);
          setError("");
        } else if (status === 500) {
          console.error("Server error details:", errorData);
          setError("Server error occurred. Please try again later or contact support.");
        } else {
          setError(`Error ${status}: ${errorData.message || 'Failed to fetch support requests'}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        setError("Unable to connect to the server. Please check your connection and try again.");
      } else {
        // Something else happened
        console.error("Request setup error:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Try the fixed endpoint
  const fetchSupportRequestsFixed = async () => {
    try {
      setLoading(true);
      console.log("Fetching support requests using fixed endpoint...");
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log("No authentication token available");
        setError("Please sign in to view your support requests");
        setLoading(false);
        return;
      }
      
      let requestConfig = {
        params: { isAdmin: false },
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000
      };
      
      // Try the fixed endpoint
      const res = await axios.get("http://localhost:5000/api/student/support/fixed", requestConfig);
      console.log("Fixed support requests fetched:", res.data);
      
      setSupportRequests(Array.isArray(res.data) ? res.data : []);
      setError("");
      setSuccess("Successfully loaded support requests using fixed method!");
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (error) {
      console.error("Error fetching fixed support requests:", error);
      setError(`Fixed method failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Debug database contents
  const debugDatabase = async () => {
    try {
      console.log("Debugging database...");
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("No token found. Please sign in first.");
        return;
      }
      
      const response = await axios.get(
        "http://localhost:5000/api/student/support/debug-db",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log("Database debug info:", response.data);
      alert(`Database debug successful! Check console for details.\nTotal requests: ${response.data.totalSupportRequests}\nUser requests: ${response.data.userRequestsById} (by ID) / ${response.data.userRequestsByIdString} (by ID string)`);
    } catch (error) {
      console.error("Database debug failed:", error);
      alert(`Database debug failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Test connection function to debug the issue
  const testConnection = async () => {
    try {
      console.log("Testing connection...");
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("No token found. Please sign in first.");
        return;
      }
      
      const response = await axios.get(
        "http://localhost:5000/api/student/support/test-connection",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log("Connection test successful:", response.data);
      alert(`Connection test successful! User ID: ${response.data.user?.id}, Total requests in DB: ${response.data.totalSupportRequests}`);
    } catch (error) {
      console.error("Connection test failed:", error);
      alert(`Connection test failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Alternative fetch method using public endpoint for debugging
  const fetchSupportRequestsPublic = async () => {
    try {
      setLoading(true);
      console.log("Fetching support requests using public endpoint...");
      
      const res = await axios.get("http://localhost:5000/api/student/support/public");
      console.log("Public support requests fetched:", res.data);
      
      // Filter by current user if we have user info
      const currentUserId = localStorage.getItem('userId'); // Assuming userId is stored separately
      let filteredRequests = res.data;
      
      if (currentUserId) {
        filteredRequests = res.data.filter(request => request.studentID === currentUserId);
      }
      
      setSupportRequests(Array.isArray(filteredRequests) ? filteredRequests : []);
      setError("");
      
    } catch (error) {
      console.error("Error fetching public support requests:", error);
      setError("Failed to fetch support requests using fallback method.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    fetchSupportRequests();
  }, []);  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        console.log("Deleting request with ID:", id);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("You must be signed in to delete support requests");
          return;
        }
        
        let requestConfig = {
          params: { isAdmin: false },
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        // Make the delete request
        const response = await axios.delete(`http://localhost:5000/api/student/support/${id}`, requestConfig);
        
        console.log("Delete response:", response);
        setSuccess("Support request deleted successfully!");
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
        // Refresh the support requests list
        fetchSupportRequests();
        fetchSupportRequests();
      } catch (error) {
        console.error("Delete error:", error);
        console.error("Error response:", error.response);
        setError(
          error.response?.data?.message || 
          error.response?.data?.error || 
          error.message || 
          "Failed to delete request."
        );
        // Clear error message after 5 seconds
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSecs < 60) {
      return "just now";
    } else if (diffInMins < 60) {
      return `${diffInMins} ${diffInMins === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const getStatusBadge = (status) => {
    return status === "pending" ? (
      <Badge bg="warning" className="status-badge">
        Pending
      </Badge>
    ) : (
      <Badge bg="success" className="status-badge">
        Replied
      </Badge>
    );
  };
  const filteredAndSearchedRequests = supportRequests
    .filter((req) => filter === "all" || req.status === filter)
    .filter((req) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        req.studentName.toLowerCase().includes(term) ||
        req.studentID.toLowerCase().includes(term) ||
        req.issue.toLowerCase().includes(term) ||
        req.email.toLowerCase().includes(term)
      );
    });
  return (
    <Container fluid className="support-list-container">
      <div className="support-list-header">
        <div className="text-center">
          <h1 className="support-list-title">Support Request Dashboard</h1>
          <p className="support-list-subtitle">
            Track and manage all your support interactions in one place
          </p>
        </div>

        <div className="support-list-actions">
          <Row className="align-items-center">
            <Col lg={4} md={6} sm={12}>
              <InputGroup className="search-box">
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>{" "}
                <Form.Control
                  type="text"
                  placeholder="Search by name, ID, or issue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col lg={5} md={6} sm={12}>
              <div className="filter-buttons text-center text-md-start mt-3 mt-md-0">
                {/* Debug Buttons */}
                
                
                {/* Filter Buttons */}
                <Button
                  variant={filter === "all" ? "primary" : "outline-primary"}
                  onClick={() => setFilter("all")}
                  className="me-2 mb-2 mb-md-0"
                >
                  <i className="bi bi-funnel-fill me-1"></i> All
                </Button>
                <Button
                  variant={filter === "pending" ? "warning" : "outline-warning"}
                  onClick={() => setFilter("pending")}
                  className="me-2 mb-2 mb-md-0"
                >
                  <i className="bi bi-hourglass-split me-1"></i> Pending
                </Button>
                <Button
                  variant={filter === "replied" ? "success" : "outline-success"}
                  onClick={() => setFilter("replied")}
                  className="mb-2 mb-md-0"
                >
                  <i className="bi bi-check-circle-fill me-1"></i> Replied
                </Button>
              </div>
            </Col>

            <Col lg={3} className="text-center text-lg-end mt-3 mt-lg-0">
              {" "}
              <Link to="/student/support-request" className="btn create-request-btn">
                <i className="bi bi-plus-circle me-2"></i>
                New Request
              </Link>
            </Col>
          </Row>
        </div>
      </div>{" "}
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
          className="mt-3"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccess("")}
          className="mt-3"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
        </Alert>
      )}
      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your support requests...</p>
        </div>
      ) : filteredAndSearchedRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-inbox"></i>
          </div>
          <h3>No Support Requests Found</h3>
          {searchTerm ? (
            <p>
              No results match your search criteria. Try different keywords.
            </p>
          ) : filter !== "all" ? (
            <p>
              You don't have any {filter} requests. Try viewing all requests.
            </p>
          ) : (
            <p>You haven't submitted any support requests yet.</p>
          )}{" "}
          <Link to="/student/support-request" className="btn create-request-btn">
            <i className="bi bi-plus-circle me-2"></i>
            Create Your First Request
          </Link>
        </div>
      ) : (
        <div className="request-card-container">
          {" "}
          <Row className="g-3">
            {filteredAndSearchedRequests.map((request) => (
              <Col key={request._id} lg={3} md={4} sm={6} xs={12}>
                <Card className="support-card h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div className="card-id">
                      <i className="bi bi-hash"></i>{" "}
                      {request._id.slice(-6).toUpperCase()}
                    </div>
                    {getStatusBadge(request.status)}
                  </Card.Header>

                  {request.photo && (
                    <div className="card-img-container">
                      <Card.Img
                        variant="top"
                        src={`http://localhost:5000/uploads/${request.photo}`}
                        alt="Issue Evidence"
                        className="support-card-img"
                        onClick={() => handleView(request)}
                      />
                      <div
                        className="card-img-overlay"
                        onClick={() => handleView(request)}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </div>
                    </div>
                  )}
                  <Card.Body>
                    {" "}
                    <div className="request-header">
                      <Card.Title>{request.studentName}</Card.Title>
                      <p className="text-muted student-id mb-0">
                        {request.studentID}
                      </p>
                    </div>
                    <div className="request-content mt-2">
                      <p className="request-label">Issue:</p>
                      <Card.Text className="issue-text">
                        {request.issue}
                      </Card.Text>
                    </div>
                    <div className="request-details mt-3">
                      <div className="detail-item">
                        <i className="bi bi-envelope"></i>
                        <a href={`mailto:${request.email}`}>{request.email}</a>
                      </div>
                      <div className="detail-item">
                        <i className="bi bi-telephone"></i>
                        <span>{request.contactNumber}</span>
                      </div>
                      <div className="detail-item">
                        <i className="bi bi-clock"></i>
                        <span title={formatDate(request.createdAt)}>
                          {formatRelativeTime(request.createdAt)}
                        </span>
                      </div>
                    </div>
                    {request.status === "replied" && (
                      <div className="admin-reply mt-3">
                        <div className="reply-header">
                          <i className="bi bi-reply-fill me-2"></i>
                          <span>Admin Response</span>
                        </div>
                        <p className="reply-text">
                          {request.adminReply.message}
                        </p>
                        <div className="reply-footer">
                          <span className="admin-name">
                            By: {request.adminReply.adminName}
                          </span>
                          <span
                            className="reply-time"
                            title={formatDate(request.adminReply.repliedAt)}
                          >
                            {formatRelativeTime(request.adminReply.repliedAt)}
                          </span>
                        </div>
                      </div>
                    )}
                  </Card.Body>

                  <Card.Footer>
                    <div className="card-actions">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleView(request)}
                      >
                        <i className="bi bi-eye-fill me-1"></i> View Details
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(request._id)}
                      >
                        <i className="bi bi-trash-fill me-1"></i> Delete
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}{" "}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="support-modal"
      >
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="modal-title">
            <i className="bi bi-ticket-detailed-fill me-2"></i>
            Support Request Details
            {selectedRequest && (
              <span className="ms-2">
                {getStatusBadge(selectedRequest.status)}
              </span>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          {selectedRequest && (
            <>
              <div className="modal-request-header">
                <div className="request-info">
                  <h4>{selectedRequest.studentName}</h4>
                  <p className="student-id">
                    Student ID: {selectedRequest.studentID}
                  </p>
                  <p className="request-id">
                    Request ID: {selectedRequest._id}
                  </p>
                </div>
                <div className="request-timestamp">
                  <div className="timestamp-label">Submitted:</div>
                  <div className="timestamp-value">
                    <i className="bi bi-calendar-event me-1"></i>
                    {formatDate(selectedRequest.createdAt)}
                  </div>
                </div>
              </div>
              <div className="modal-request-details">
                <div className="detail-row">
                  <div className="detail-label">Email:</div>
                  <div className="detail-value">
                    <a href={`mailto:${selectedRequest.email}`}>
                      <i className="bi bi-envelope me-1"></i>
                      {selectedRequest.email}
                    </a>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Contact:</div>
                  <div className="detail-value">
                    <i className="bi bi-telephone me-1"></i>
                    {selectedRequest.contactNumber}
                  </div>
                </div>
              </div>{" "}
              <div className="modal-issue-section">
                <h5 className="section-title">
                  <i className="bi bi-chat-text-fill me-2"></i>
                  Issue Description
                </h5>
                <div className="issue-content">{selectedRequest.issue}</div>
              </div>
              {selectedRequest.photo && (
                <div className="modal-photo-section">
                  <h5 className="section-title">Attached Photo</h5>
                  <div className="photo-container">
                    <img
                      src={`http://localhost:5000/uploads/${selectedRequest.photo}`}
                      alt="Issue Evidence"
                      className="img-fluid rounded request-photo"
                    />
                    <a
                      href={`http://localhost:5000/uploads/${selectedRequest.photo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-full-image"
                    >
                      <i className="bi bi-arrows-fullscreen"></i>
                    </a>
                  </div>
                </div>
              )}
              {selectedRequest.status === "replied" && (
                <div className="modal-reply-section">
                  <h5 className="section-title">
                    <i className="bi bi-reply-fill me-2"></i>
                    Admin Response
                  </h5>
                  <div className="admin-reply-modal">
                    <div className="reply-content">
                      {selectedRequest.adminReply.message}
                    </div>
                    <div className="reply-info">
                      <div className="admin-info">
                        <i className="bi bi-person-badge me-1"></i>
                        {selectedRequest.adminReply.adminName}
                      </div>
                      <div className="reply-time">
                        <i className="bi bi-clock-history me-1"></i>
                        {formatDate(selectedRequest.adminReply.repliedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            <i className="bi bi-x-circle me-2"></i>
            Close
          </Button>          {selectedRequest && (
            <Button
              variant="danger"
              onClick={() => {
                setShowModal(false);
                handleDelete(selectedRequest._id);
              }}
            >
              <i className="bi bi-trash-fill me-2"></i>
              Delete Request
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <div className="support-list-footer">
        {" "}
        <Link to="/student/supportdesk" className="btn back-button">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Support Desk
        </Link>
        <p className="support-help-text">
          Need more help? Contact our support team at{" "}
          <a href="mailto:support@veritascampus.edu">
            support@veritascampus.edu
          </a>
        </p>
      </div>
    </Container>
  );
};

export default SupportList;
