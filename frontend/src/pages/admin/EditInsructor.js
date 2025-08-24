// EditInstructorForm.jsx - Corrected Version
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditInstructorForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get instructor ID from URL params
  
  const [formData, setFormData] = useState({
    name: '', // Changed from firstName/lastName to just name
    email: '',
    contactNumber: '', // Changed from phone to phonenumber
    department: '',
    assignedCourse: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Available courses for each department
  const coursesByDepartment = {
    'Diploma in Human Resource Management': [
      'Introduction to HR Management',
      'Recruitment and Selection',
      'Employee Relations',
      'Performance Management',
      'HR Analytics',
      'Compensation and Benefits'
    ],
    'Diploma in Business Administration': [
      'Business Fundamentals',
      'Marketing Management',
      'Operations Management',
      'Strategic Management',
      'Business Ethics',
      'Entrepreneurship'
    ],
    'Diploma in English': [
      'English Literature',
      'Creative Writing',
      'Academic Writing',
      'Business Communication',
      'Grammar and Composition',
      'Public Speaking'
    ],
    'Diploma in Internal Sales & Marketing': [
      'Sales Fundamentals',
      'Digital Marketing',
      'Customer Relationship Management',
      'Sales Psychology',
      'Market Research',
      'Brand Management'
    ]
  };

  // Get available courses based on selected department
  const getAvailableCourses = () => {
    return coursesByDepartment[formData.department] || [];
  };

  // Fetch instructor data when component mounts
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setIsLoading(true);
        setApiError(null); // Clear any previous errors
        
        console.log('Fetching instructor with ID:', id); // Debug log
        
        // Try multiple possible API endpoints
        let response;
        try {
          response = await axios.get(`http://localhost:5000/api/instructors/${id}`);
        } catch (error) {
          // If first endpoint fails, try the original one
          console.log('First endpoint failed, trying alternative...');
          response = await axios.get(`http://localhost:5000/api/instructors/${id}`);
        }
        
        console.log('API Response:', response); // Debug log
        console.log('Response data:', response.data); // Debug log
        
        // Handle different response structures
        let instructorData;
        if (response.data.data) {
          instructorData = response.data.data;
        } else if (response.data.instructor) {
          instructorData = response.data.instructor;
        } else {
          instructorData = response.data;
        }
        
        console.log('Instructor data to set:', instructorData); // Debug log
        
        // Map the API data to form data structure
        const dataToSet = {
          name: instructorData.name || '',
          email: instructorData.email || '',
          contactNumber: instructorData.contactNumber || instructorData.contactNumber || instructorData.phone || '',
          department: instructorData.department || '',
          assignedCourse: instructorData.assignedCourse || instructorData.assigned_course || '',
        };
        
        console.log('Data being set to form:', dataToSet); // Debug log
        setFormData(dataToSet);
        
      } catch (error) {
        console.error('Error fetching instructor:', error);
        console.error('Error response:', error.response); // More detailed error logging
        
        if (error.response) {
          // Server responded with error status
          setApiError(`Failed to load instructor: ${error.response.data?.message || error.response.statusText} (Status: ${error.response.status})`);
        } else if (error.request) {
          // Request was made but no response received
          setApiError('No response from server. Please check if the backend is running on http://localhost:5000');
        } else {
          // Something else happened
          setApiError('Failed to load instructor data. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      console.log('Component mounted with ID:', id); // Debug log
      fetchInstructor();
    } else {
      console.error('No instructor ID provided in URL params');
      setApiError('No instructor ID provided. Please select an instructor to edit.');
      setIsLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If department changes, reset assigned course
    if (name === 'department') {
      setFormData({
        ...formData,
        [name]: value,
        assignedCourse: '', // Reset course when department changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate phone number
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Phone number is required';
    } else {
      const cleanPhone = formData.contactNumber.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        newErrors.contactNumber = 'Phone number must be at least 10 digits';
      } else if (cleanPhone.length > 15) {
        newErrors.contactNumber = 'Phone number is too long';
      }
    }
    
    // Validate department
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    // Validate assigned course
    if (!formData.assignedCourse.trim()) {
      newErrors.assignedCourse = 'Assigned course is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      console.log('Submitting data:', formData); // Debug log
      
      // Try multiple possible API endpoints for update
      let response;
      try {
        response = await axios.put(`http://localhost:5000/api/instructors/${id}`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        // If first endpoint fails, try the original one
        console.log('First update endpoint failed, trying alternative...');
        response = await axios.put(`http://localhost:5000/api/instructors/${id}`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      console.log('Update response:', response); // Debug log
      setShowSuccess(true);
      
      // Show success message briefly before navigating
      setTimeout(() => {
        // Navigate to the ManageInstructors page after successful submission
        navigate('/admin/allinstrutors');
      }, 2000);
    } catch (error) {
      console.error('Error updating instructor:', error);
      console.error('Error response:', error.response); // More detailed error logging
      
      setApiError(
        error.response?.data?.message || 
        'An error occurred while updating the instructor. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '30px',
      maxWidth: '700px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '30px',
      textAlign: 'center',
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#2c3e50',
      margin: '0',
    },
    subtitle: {
      fontSize: '16px',
      color: '#7f8c8d',
      marginTop: '8px',
    },
    requiredNote: {
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '25px',
      fontSize: '14px',
      color: '#856404',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px',
    },
    label: {
      marginBottom: '8px',
      fontWeight: '600',
      fontSize: '14px',
      color: '#2c3e50',
    },
    asterisk: {
      color: '#e74c3c',
      marginLeft: '2px',
    },
    input: {
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '6px',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease',
      backgroundColor: '#fff',
    },
    inputFocused: {
      borderColor: '#3498db',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)',
    },
    select: {
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: '#fff',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease',
      cursor: 'pointer',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginTop: '30px',
    },
    submitButton: {
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '14px 28px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '120px',
    },
    submitButtonHover: {
      backgroundColor: '#219a52',
      transform: 'translateY(-2px)',
    },
    cancelButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '14px 28px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '120px',
    },
    cancelButtonHover: {
      backgroundColor: '#7f8c8d',
      transform: 'translateY(-2px)',
    },
    errorMessage: {
      color: '#e74c3c',
      fontSize: '12px',
      marginTop: '5px',
      fontWeight: '500',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontSize: '18px',
      color: '#7f8c8d',
    },
    loadingSpinner: {
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      border: '1px solid #c3e6cb',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '20px',
      color: '#155724',
      textAlign: 'center',
      fontWeight: '500',
    },
    errorAlert: {
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '20px',
      color: '#721c24',
      textAlign: 'center',
      fontWeight: '500',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '15px',
      marginTop: '25px',
      paddingBottom: '8px',
      borderBottom: '2px solid #ecf0f1',
    },
    debugInfo: {
      backgroundColor: '#e8f4f8',
      border: '1px solid #bee5eb',
      padding: '15px',
      borderRadius: '6px',
      marginBottom: '20px',
      fontSize: '12px',
      color: '#0c5460',
      fontFamily: 'monospace',
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.formCard}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p>Loading instructor data...</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              Fetching instructor ID: {id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .submit-btn:hover {
            background-color: #219a52 !important;
            transform: translateY(-2px);
          }
          
          .cancel-btn:hover {
            background-color: #7f8c8d !important;
            transform: translateY(-2px);
          }
          
          .form-input:focus {
            border-color: #3498db !important;
            outline: none;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
          }
        `}
      </style>
      
      <div style={styles.formCard}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Edit Instructor</h1>
          <p style={styles.subtitle}>Update instructor information</p>
        </div>

        
        
        <div style={styles.requiredNote}>
          <strong>Note:</strong> All fields marked with an asterisk (*) are required.
        </div>

        {showSuccess && (
          <div style={styles.successMessage}>
            ✅ Instructor has been updated successfully! Redirecting...
          </div>
        )}

        {apiError && (
          <div style={styles.errorAlert}>
            ❌ {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <h3 style={styles.sectionTitle}>Personal Information</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Full Name<span style={styles.asterisk}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              style={{
                ...styles.input,
                borderColor: errors.name ? '#e74c3c' : formData.name ? '#27ae60' : '#e9ecef',
              }}
              placeholder="Enter full name"
            />
            {errors.name && <p style={styles.errorMessage}>{errors.name}</p>}
          </div>

          {/* Contact Information */}
          <h3 style={styles.sectionTitle}>Contact Information</h3>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Email Address<span style={styles.asterisk}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                style={{
                  ...styles.input,
                  borderColor: errors.email ? '#e74c3c' : formData.email ? '#27ae60' : '#e9ecef',
                }}
                placeholder="Enter email address"
              />
              {errors.email && <p style={styles.errorMessage}>{errors.email}</p>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Phone Number<span style={styles.asterisk}>*</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="form-input"
                style={{
                  ...styles.input,
                  borderColor: errors.contactNumber ? '#e74c3c' : formData.contactNumber ? '#27ae60' : '#e9ecef',
                }}
                placeholder="Enter phone number"
              />
              {errors.contactNumber && <p style={styles.errorMessage}>{errors.contactNumber}</p>}
            </div>
          </div>

          {/* Professional Information */}
          <h3 style={styles.sectionTitle}>Professional Information</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Department<span style={styles.asterisk}>*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-input"
              style={{
                ...styles.select,
                borderColor: errors.department ? '#e74c3c' : formData.department ? '#27ae60' : '#e9ecef',
              }}
            >
              <option value="">Select Department</option>
              <option value="Diploma in Human Resource Management">Diploma in Human Resource Management</option>
              <option value="Diploma in Business Administration">Diploma in Business Administration</option>
              <option value="Diploma in English">Diploma in English</option>
              <option value="Diploma in Internal Sales & Marketing">Diploma in Internal Sales & Marketing</option>
            </select>
            {errors.department && <p style={styles.errorMessage}>{errors.department}</p>}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Assigned Course<span style={styles.asterisk}>*</span>
            </label>
            <select
              name="assignedCourse"
              value={formData.assignedCourse}
              onChange={handleChange}
              className="form-input"
              style={{
                ...styles.select,
                borderColor: errors.assignedCourse ? '#e74c3c' : formData.assignedCourse ? '#27ae60' : '#e9ecef',
              }}
              disabled={!formData.department}
            >
              <option value="">
                {!formData.department ? 'Select department first' : 'Select assigned course'}
              </option>
              {getAvailableCourses().map(course => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            {errors.assignedCourse && <p style={styles.errorMessage}>{errors.assignedCourse}</p>}
            {!formData.department && (
              <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>
                Please select a department to see available courses
              </p>
            )}
          </div>
          
          <div style={styles.buttonContainer}>
            <button 
              type="button" 
              className="cancel-btn"
              style={styles.cancelButton}
              onClick={() => navigate('/allinstrutors')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
              style={{
                ...styles.submitButton,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? '⏳ Updating...' : '✅ Update Instructor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInstructorForm;