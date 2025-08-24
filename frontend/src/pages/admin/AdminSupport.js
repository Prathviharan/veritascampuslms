import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/supportCSS.css";
import { MdDownload } from "react-icons/md";
import html2pdf from "html2pdf.js";


// Section component
const Section = ({ title, requests, onStatusChange, showUserId }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="subtitle">{title}</h2>
      <table border="1" className="atable">
        <thead className="thead">
          <tr>
            {showUserId && <th>User ID</th>}
            <th>Name</th>
            <th>Status</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {requests.length === 0 ? (
            <tr>
              <td colSpan="5">No requests available</td>
            </tr>
          ) : (
            requests.map((req) => (
              <tr key={req._id}>
                {showUserId && <td>{req.studentID || "N/A"}</td>}
                <td>{req.studentName || req.lectureName || "N/A"}</td>
                <td>
                  <span
                    className={`status-label ${
                      req.status
                        ? req.status.toLowerCase().replace(/\s/g, "-")
                        : "pending"
                    }`}
                  >
                    {req.status || "Pending"}
                  </span>
                </td>
                <td>
                  {(req.issue || req.message || "No description").length > 50
                    ? (req.issue || req.message).substring(0, 50) + "..."
                    : req.issue || req.message || "No description"}
                </td>
                <td>
                  <div className="action">
                  <button
                    className="v-btn"
                    onClick={() =>
                      navigate(`/admin/singleViewSupport/${req._id}`)
                    }
                  >
                    View
                  </button>
                  <select
                    value={req.status || "Pending"}
                    onChange={(e) => onStatusChange(req._id, e.target.value)}
                    className="select"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                  </div>
                </td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Main AdminSupport component
const AdminSupport = () => {
  const [studentRequests, setStudentRequests] = useState([]);
  const [instructorRequests, setInstructorRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const downloadPageAsPDF = () => {
    const element = document.getElementById("download-section");
    html2pdf().from(element).save("SupportRequests.pdf");
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/adminsupport/students")
      .then((res) => setStudentRequests(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/api/adminsupport/instructors")
      .then((res) => setInstructorRequests(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    axios
      .put(`http://localhost:5000/api/adminsupport/updateStatus/${id}`, {
        status: newStatus,
      })
      .then((res) => {
        alert(`Status updated to ${newStatus}`);

        setStudentRequests((prev) =>
          prev.map((req) =>
            req._id === id ? { ...req, status: newStatus } : req
          )
        );

        setInstructorRequests((prev) =>
          prev.map((req) =>
            req._id === id ? { ...req, status: newStatus } : req
          )
        );
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Failed to update status");
      });
  };

  const filteredStudentRequests = studentRequests.filter(
    (req) =>
      (req.studentName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (req.status || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInstructorRequests = instructorRequests.filter(
    (req) =>
      (req.lectureName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (req.status || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-support-container">
      
      <div className="body">
        <h1 className="title">Support Requests</h1>

        <div className="header">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="asearch-input"
          />
          <button className="abtn" onClick={downloadPageAsPDF}>
            <MdDownload size={17} style={{ verticalAlign: "middle" }} /> Export
            as PDF
          </button>
        </div>

        <div id="download-section">
          <div className="section1">
            <Section
              title="Students Support Requests"
              requests={filteredStudentRequests}
              onStatusChange={handleStatusChange}
              showUserId={true}
            />
          </div>
          <div className="section2">
            <Section
              title="Instructors Support Requests"
              requests={filteredInstructorRequests}
              onStatusChange={handleStatusChange}
              showUserId={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
