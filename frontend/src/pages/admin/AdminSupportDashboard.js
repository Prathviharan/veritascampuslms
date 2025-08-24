// src/pages/admin/AdminSupportDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import './AdminSupportDashboard.css'; // Uncomment this line to use the CSS

const AdminSupportDashboard = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'replied'
  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Admin fetching all support requests...");

      // Try multiple endpoints to ensure we get all support requests
      let supportRequests = [];

      try {
        // Primary endpoint - dedicated admin endpoint (no auth required)
        const res = await axios.get(
          "http://localhost:5000/api/student/support/admin",
          {
            params: { isAdmin: true },
            timeout: 10000,
          }
        );

        if (Array.isArray(res.data)) {
          supportRequests = res.data;
          console.log(
            "Fetched support requests via admin endpoint:",
            supportRequests.length
          );
        } else {
          console.warn("Admin endpoint returned non-array data:", res.data);
        }
      } catch (adminError) {
        console.warn("Admin endpoint failed:", adminError.message);

        // Fallback to the primary endpoint with auth
        try {
          const res = await axios.get(
            "http://localhost:5000/api/student/support",
            {
              params: { isAdmin: true },
              timeout: 10000,
            }
          );

          if (Array.isArray(res.data)) {
            supportRequests = res.data;
            console.log(
              "Fetched support requests via primary endpoint:",
              supportRequests.length
            );
          } else {
            console.warn("Primary endpoint returned non-array data:", res.data);
          }
        } catch (primaryError) {
          console.warn("Primary endpoint also failed:", primaryError.message);

          // Try the fixed endpoint
          try {
            const res = await axios.get(
              "http://localhost:5000/api/student/support/fixed",
              {
                params: { isAdmin: true },
                timeout: 10000,
              }
            );

            if (Array.isArray(res.data)) {
              supportRequests = res.data;
              console.log(
                "Fetched support requests via fixed endpoint:",
                supportRequests.length
              );
            }
          } catch (fallbackError) {
            console.warn("Fixed endpoint also failed:", fallbackError.message);

            // Last resort - try public endpoint (for debugging)
            try {
              const res = await axios.get(
                "http://localhost:5000/api/student/support/public",
                {
                  timeout: 10000,
                }
              );

              if (Array.isArray(res.data)) {
                supportRequests = res.data;
                console.log(
                  "Fetched support requests via public endpoint:",
                  supportRequests.length
                );
              }
            } catch (publicError) {
              console.error("All endpoints failed:", publicError.message);
              throw new Error(
                "Unable to fetch support requests from any endpoint"
              );
            }
          }
        }
      }

      // Filter out any requests that are marked as deleted by user
      const filteredRequests = supportRequests.filter(
        (request) => !request.isDeletedByUser
      );
      console.log(
        "Support requests after filtering deleted ones:",
        filteredRequests.length
      );

      setSupportRequests(filteredRequests);

      if (filteredRequests.length === 0) {
        console.log("No support requests found");
      } else {
        console.log(
          "Successfully loaded support requests:",
          filteredRequests.map((req) => ({
            id: req._id,
            student: req.studentName,
            status: req.status,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching support requests:", error);
      setError(`Failed to fetch support requests: ${error.message}`);
      setSupportRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const handleReplyClick = (request) => {
    console.log("Opening reply modal for request:", request);
    setSelectedRequest(request);
    setReplyMessage(request.adminReply?.message || "");
    setAdminName(request.adminReply?.adminName || ""); // Pre-fill admin name if editing
    setError(""); // Clear any previous errors
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setReplyMessage("");
    setAdminName("");
    setError("");
    setSubmitting(false);
  };
  const handleSubmitReply = async (e) => {
    e.preventDefault();

    console.log("Submitting reply for request:", selectedRequest?._id);
    console.log("Reply message:", replyMessage);
    console.log("Admin name:", adminName);

    if (!replyMessage.trim()) {
      setError("Reply message cannot be empty.");
      return;
    }

    if (!adminName.trim()) {
      setError("Admin name is required.");
      return;
    }

    if (!selectedRequest || !selectedRequest._id) {
      setError("No request selected.");
      return;
    }

    try {
      setSubmitting(true);
      setError(""); // Clear any previous errors

      console.log(
        "Sending reply to:",
        `http://localhost:5000/api/student/support/${selectedRequest._id}/reply`
      );

      const response = await axios.post(
        `http://localhost:5000/api/student/support/${selectedRequest._id}/reply`,
        {
          message: replyMessage.trim(),
          adminName: adminName.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("Reply response:", response.data);

      // Check if the response contains the updated request data
      if (response.data && response.data.data) {
        // Update the list with the updated request
        setSupportRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === selectedRequest._id ? response.data.data : req
          )
        );

        setSuccessMessage("Reply sent successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        handleCloseModal();

        // Refresh the support requests to ensure we have the latest data
        setTimeout(() => {
          fetchSupportRequests();
        }, 1000);
      } else {
        console.warn("Unexpected response format:", response.data);
        setError(
          "Reply may have been sent but response format was unexpected. Please refresh the page."
        );
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      console.error("Error response:", error.response?.data);

      if (error.response) {
        // Server responded with an error status
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        setError(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        setError(
          "No response from server. Please check if the backend is running."
        );
      } else {
        // Something else happened
        setError(`Error: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    console.log("Delete request for ID:", id);

    // Find the request to check its status
    const requestToDelete = supportRequests.find((req) => req._id === id);

    if (!requestToDelete) {
      setError("Support request not found.");
      return;
    }

    console.log("Request to delete:", {
      id: requestToDelete._id,
      status: requestToDelete.status,
      studentName: requestToDelete.studentName,
    });

    // Only allow deletion if the request status is 'replied'
    if (requestToDelete.status !== "replied") {
      setError("Only replied requests can be deleted.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete this replied request from ${requestToDelete.studentName}?`
      )
    ) {
      try {
        console.log("Admin deleting request with ID:", id);
        setError(""); // Clear any previous errors

        // Try multiple endpoints for better reliability
        let deleteSuccess = false;
        let lastError = null;

        // First, try the admin-specific delete endpoint
        try {
          console.log("Trying admin delete endpoint...");
          await axios.delete(
            `http://localhost:5000/api/student/support/${id}/admin`,
            {
              params: { isAdmin: true },
              timeout: 10000,
            }
          );
          deleteSuccess = true;
          console.log("Admin delete endpoint succeeded");
        } catch (adminError) {
          console.warn("Admin delete endpoint failed:", adminError.message);
          lastError = adminError;

          // Fallback to regular delete endpoint with admin flag
          try {
            console.log("Trying regular delete endpoint with admin flag...");
            await axios.delete(
              `http://localhost:5000/api/student/support/${id}`,
              {
                params: { isAdmin: true },
                timeout: 10000,
              }
            );
            deleteSuccess = true;
            console.log("Regular delete endpoint with admin flag succeeded");
          } catch (regularError) {
            console.warn(
              "Regular delete endpoint also failed:",
              regularError.message
            );
            lastError = regularError;
          }
        }

        if (deleteSuccess) {
          setSuccessMessage("Support request deleted successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);

          // Remove the deleted request from the local state immediately
          setSupportRequests((prevRequests) =>
            prevRequests.filter((req) => req._id !== id)
          );

          // Also refresh the data to ensure consistency
          setTimeout(() => {
            fetchSupportRequests();
          }, 1000);
        } else {
          throw lastError || new Error("All delete endpoints failed");
        }
      } catch (error) {
        console.error("Admin delete error:", error);
        console.error("Error response:", error.response?.data);

        let errorMessage = "Failed to delete request.";

        if (error.response) {
          errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage =
            "No response from server. Please check if the backend is running.";
        } else {
          errorMessage = error.message || "Unknown error occurred.";
        }

        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    }
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

  const filteredRequests =
    filter === "all"
      ? supportRequests
      : supportRequests.filter((req) => req.status === filter);

  // Test function to verify reply endpoint
  const testReplyEndpoint = async () => {
    if (supportRequests.length === 0) {
      alert("No support requests available to test");
      return;
    }

    const testRequest = supportRequests[0];
    try {
      const response = await axios.post(
        `http://localhost:5000/api/student/support/${testRequest._id}/reply`,
        {
          message: "Test reply from admin dashboard",
          adminName: "Test Admin",
        }
      );

      console.log("Test reply successful:", response.data);
      alert("Test reply sent successfully! Check console for details.");
      fetchSupportRequests();
    } catch (error) {
      console.error("Test reply failed:", error);
      alert(
        `Test reply failed: ${error.response?.data?.message || error.message}`
      );
    }
  };

  // Test function to verify delete endpoint
  const testDeleteEndpoint = async () => {
    const repliedRequests = supportRequests.filter(
      (req) => req.status === "replied"
    );

    if (repliedRequests.length === 0) {
      alert("No replied support requests available to test delete");
      return;
    }

    const testRequest = repliedRequests[0];

    if (
      !window.confirm(
        `Test delete functionality on request from ${testRequest.studentName}? This will permanently delete the request.`
      )
    ) {
      return;
    }

    try {
      // Test admin delete endpoint
      const response = await axios.delete(
        `http://localhost:5000/api/student/support/${testRequest._id}/admin`,
        {
          params: { isAdmin: true },
        }
      );

      console.log("Test delete successful:", response.data);
      alert("Test delete successful! Check console for details.");
      fetchSupportRequests();
    } catch (error) {
      console.error("Test delete failed:", error);
      alert(
        `Test delete failed: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Admin Support Dashboard</h2>
          <p className="text-muted">
            Manage all student support requests ({supportRequests.length} total)
          </p>
        </div>
        <div className="admin-actions">
          <div className="filter-buttons">
            <Button
              variant={filter === "all" ? "primary" : "outline-primary"}
              onClick={() => setFilter("all")}
              className="me-2"
            >
              All ({supportRequests.length})
            </Button>
            <Button
              variant={filter === "pending" ? "warning" : "outline-warning"}
              onClick={() => setFilter("pending")}
              className="me-2"
            >
              Pending (
              {supportRequests.filter((req) => req.status === "pending").length}
              )
            </Button>
            <Button
              variant={filter === "replied" ? "success" : "outline-success"}
              onClick={() => setFilter("replied")}
            >
              Replied (
              {supportRequests.filter((req) => req.status === "replied").length}
              )
            </Button>
          </div>
        </div>
      </div>

      {successMessage && (
        <Alert
          variant="success"
          onClose={() => setSuccessMessage("")}
          dismissible
        >
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h3>No Support Requests Found</h3>
          {filter === "all" ? (
            <div>
              <p className="lead">
                No student support requests have been submitted yet.
              </p>
              <p className="text-muted">
                Students can submit requests via the Support Desk or Support
                Request form.
              </p>
            </div>
          ) : (
            <p className="lead">No {filter} support requests found.</p>
          )}
          <Button
            variant="primary"
            onClick={fetchSupportRequests}
            className="mt-3"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh Data
          </Button>
        </div>
      ) : (
        <Row>
          {filteredRequests.map((request) => (
            <Col key={request._id} md={6} lg={4} className="mb-4">
              <Card className="admin-support-card h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">#{request._id.slice(-6)}</span>
                  {getStatusBadge(request.status)}
                </Card.Header>
                <Card.Body>
                  <Card.Title>{request.studentName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {request.studentID}
                  </Card.Subtitle>
                  <div className="mt-3">
                    <p>
                      <strong>Issue:</strong>
                    </p>
                    <p className="issue-text">{request.issue}</p>
                  </div>
                  {request.adminReply && request.adminReply.message && (
                    <div className="admin-reply mt-3 p-2 rounded">
                      <p className="mb-1">
                        <strong>Admin Reply:</strong>
                      </p>
                      <p className="mb-1">{request.adminReply.message}</p>
                      <p className="text-muted mb-0">
                        <small>
                          By: {request.adminReply.adminName} |
                          {request.adminReply.repliedAt &&
                            ` at ${formatDate(request.adminReply.repliedAt)}`}
                        </small>
                      </p>
                    </div>
                  )}{" "}
                </Card.Body>
                <Card.Footer>
                  <div className="card-actions d-flex">
                    <Button
                      className="submit-btn me-2 flex-grow-1"
                      onClick={() => handleReplyClick(request)}
                    >
                      {request.status === "pending" ? "Reply" : "Edit Reply"}
                    </Button>
                    {request.status === "replied" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(request._id)}
                        className="delete-btn"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </Button>
                    )}
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Reply Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedRequest?.status === "pending"
              ? "Reply to Request"
              : "Edit Reply"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <div className="mb-3">
                <h5>Student: {selectedRequest.studentName}</h5>
                <p className="text-muted">
                  Submitted: {formatDate(selectedRequest.createdAt)}
                </p>
                <p>
                  <strong>Issue:</strong> {selectedRequest.issue}
                </p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmitReply}>
                  <Form.Group className="mb-3">
                    <Form.Label>Admin Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      required
                      placeholder="Enter your name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Your Reply</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      required
                      placeholder="Type your reply here..."
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    {" "}
                    <Button
                      variant="secondary"
                      onClick={handleCloseModal}
                      className="me-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="submit-btn"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Sending...
                        </>
                      ) : (
                        "Send Reply"
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminSupportDashboard;
