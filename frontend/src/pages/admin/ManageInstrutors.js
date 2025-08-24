// Instructor.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../../css/ManageInstructors.css';

const API_URL = 'http://localhost:5000/api/instructors';

const Instructor = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingInstructor, setDeleteingInstructor] = useState(null);

  const fetchInstructors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}`);
      console.log('API Response:', response.data);
      
      // Ensure the response is an array and handle different response structures
      let instructorData = [];
      if (Array.isArray(response.data)) {
        instructorData = response.data;
      } else if (response.data && Array.isArray(response.data.instructors)) {
        instructorData = response.data.instructors;
      } else if (response.data && Array.isArray(response.data.data)) {
        instructorData = response.data.data;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        instructorData = response.data.data;
      }
      
      console.log('Processed instructor data:', instructorData);
      setInstructors(instructorData);
    } catch (err) {
      console.error('Error fetching instructors:', err);
      setError('Failed to fetch instructors. Please check your connection and try again.');
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleEdit = (instructor) => {
    // Navigate to edit page with instructor ID
    navigate(`/admin/editinstructor/${instructor._id}`, { 
      state: { instructor } 
    });
  };

  const handleDelete = async (instructor) => {
    setDeleteingInstructor(instructor);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingInstructor) return;

    try {
      await axios.delete(`${API_URL}/${deletingInstructor._id}`);
      setInstructors(instructors.filter((inst) => inst._id !== deletingInstructor._id));
      setShowDeleteConfirm(false);
      setDeleteingInstructor(null);
    } catch (err) {
      console.error('Error deleting instructor:', err);
      setError('Failed to delete instructor. Please try again.');
      setShowDeleteConfirm(false);
      setDeleteingInstructor(null);
    }
  };

  // Extract unique departments for filter - ensure instructors is always an array
  const departments = [...new Set((instructors || [])
    .map((i) => i?.department)
    .filter(dept => dept && dept.trim() !== ''))];

  const filteredInstructors = (instructors || []).filter((instructor) => {
    const matchesSearch = instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         instructor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         false;
    const matchesDepartment = selectedDepartment ? instructor?.department === selectedDepartment : true;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <h1>Manage Instructors</h1>
        <div className="dashboard-actions">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="department-filter"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <button 
            className="refresh-button" 
            onClick={fetchInstructors}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button className="retry-button" onClick={fetchInstructors}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          Loading instructors...
        </div>
      ) : (
        <div className="material-table-container">
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Department</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstructors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-results">
                    {instructors.length === 0 ? 'No instructors available.' : 'No instructors match your search criteria.'}
                  </td>
                </tr>
              ) : (
                filteredInstructors.map((instructor) => (
                  <tr key={instructor._id || instructor.id} className="faculty-row">
                    <td className="name-cell">{instructor.name || 'N/A'}</td>
                    <td>
                      <div className="contact-details">
                        <div className="contact-item">
                          📧 {instructor.email || 'N/A'}
                        </div>
                        <div className="contact-item">
                          📞 {instructor.phone || instructor.contactNumber || instructor.contact || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="department-cell">{instructor.department || 'N/A'}</td>
                    <td className="course-cell">
                      {instructor.assignedCourse || instructor.course || instructor.courses || 'N/A'}
                    </td>
                    <td className="actions-col">
                      <div className="action-buttons">
                        <button 
                          className="edit-button" 
                          onClick={() => handleEdit(instructor)}
                          title="Edit Instructor"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="delete-button" 
                          onClick={() => handleDelete(instructor)}
                          title="Delete Instructor"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && instructors.length > 0 && (
        <div className="table-footer">
          <p className="results-count">
            Showing {filteredInstructors.length} of {instructors.length} instructors
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingInstructor && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{deletingInstructor.name}</strong>?</p>
            <div className="instructor-info">
              <p><strong>Email:</strong> {deletingInstructor.email}</p>
              <p><strong>Department:</strong> {deletingInstructor.department}</p>
            </div>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="delete-confirm-button" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructor;