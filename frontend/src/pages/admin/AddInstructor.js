// ModifiedInstructorForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InstructorForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    contactNumber: '',
    assignedCourse: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sample courses data - replace with actual API call
  const availableCourses = [
    { id: 'HRM001', name: 'Diploma in Human Resource Management' },
    { id: 'BBA001', name: 'Diploma in Business Administration' },
    { id: 'ENG001', name: 'Diploma in English' },
    { id: 'SMK001', name: 'Diploma in Internal Sales & Marketing' },
    { id: 'IT001', name: 'Diploma in Information Technology' },
    { id: 'ACC001', name: 'Diploma in Accounting' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special validation for name (only letters and spaces)
    if (name === 'name' && value !== '') {
      const letterRegex = /^[A-Za-z\s]+$/;
      if (!letterRegex.test(value)) {
        setErrors({
          ...errors,
          [name]: 'Only letters and spaces are allowed'
        });
        return;
      }
    }
    
    // Special validation for contact number (only numbers)
    if (name === 'contactNumber') {
      const numberRegex = /^[0-9]*$/;
      if (value !== '' && !numberRegex.test(value)) {
        setErrors({
          ...errors,
          [name]: 'Only numbers are allowed'
        });
        return;
      }
      
      // Restrict to maximum 10 digits
      if (value.length > 10) {
        return;
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // Password should be at least 8 characters with at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name should only contain letters and spaces';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    // Contact number validation
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be exactly 10 digits';
    }
    
    // Assigned course validation
    if (!formData.assignedCourse) {
      newErrors.assignedCourse = 'Assigned course is required';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with at least one letter and one number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Prepare data for submission (exclude confirmPassword)
      const submitData = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        contactNumber: formData.contactNumber,
        assignedCourse: formData.assignedCourse,
        password: formData.password
      };
      
      // Send data to the backend API
      const response = await axios.post('http://localhost:5000/api/instructors', submitData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Instructor added:', response.data);
      setShowSuccess(true);
      
      // Show success message briefly before navigating
      setTimeout(() => {
        navigate('/admin/allinstrutors');
      }, 1500);
    } catch (error) {
      console.error('Error adding instructor:', error);
      setApiError(
        error.response?.data?.message || 
        'An error occurred while adding the instructor. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Styles
  const styles = {
    container: {
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#333',
    },
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      padding: '30px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '30px',
      borderBottom: '1px solid #eaeaea',
      paddingBottom: '15px',
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#2c3e50',
      margin: '0',
    },
    requiredNote: {
      backgroundColor: '#fff8e1',
      padding: '12px 20px',
      borderRadius: '6px',
      marginBottom: '25px',
      fontSize: '14px',
      color: '#856404',
      display: 'flex',
      alignItems: 'center',
      borderLeft: '4px solid #ffc107',
    },
    infoIcon: {
      marginRight: '10px',
      fontSize: '18px',
      color: '#ffc107',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '5px',
    },
    fullWidth: {
      gridColumn: '1 / -1',
    },
    label: {
      marginBottom: '8px',
      fontWeight: '500',
      fontSize: '14px',
      color: '#4a5568',
    },
    asterisk: {
      color: '#e53e3e',
      marginLeft: '2px',
    },
    input: {
      padding: '12px 16px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '15px',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    passwordContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    passwordInput: {
      padding: '12px 45px 12px 16px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '15px',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    eyeButton: {
      position: 'absolute',
      right: '12px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      color: '#718096',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    select: {
      padding: '12px 16px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '15px',
      backgroundColor: '#fff',
      width: '100%',
      boxSizing: 'border-box',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23718096\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      backgroundSize: '16px',
    },
    submitButton: {
      backgroundColor: '#95C436',
      color: 'white',
      border: '1px solid #3E9355',
      borderRadius: '6px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'background-color 0.3s',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '30px',
      gap: '15px',
    },
    cancelButton: {
      backgroundColor: '#D7D7D7',
      color: 'white',
      border: '1px solid #9B9B9B',
      borderRadius: '6px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'background-color 0.3s',
    },
    successMessage: {
      backgroundColor: '#e8f5e9',
      padding: '14px 20px',
      borderRadius: '6px',
      marginBottom: '20px',
      color: '#2e7d32',
      display: 'flex',
      alignItems: 'center',
      borderLeft: '4px solid #4caf50',
    },
    successIcon: {
      marginRight: '10px',
      fontSize: '18px',
      color: '#4caf50',
    },
    errorMessage: {
      backgroundColor: '#ffebee',
      padding: '14px 20px',
      borderRadius: '6px',
      marginBottom: '20px',
      color: '#c62828',
      display: 'flex',
      alignItems: 'center',
      borderLeft: '4px solid #f44336',
    },
    errorIcon: {
      marginRight: '10px',
      fontSize: '18px',
      color: '#f44336',
    },
    fieldError: {
      color: '#e53e3e',
      fontSize: '13px',
      marginTop: '6px',
    },
    passwordStrengthInfo: {
      fontSize: '12px',
      color: '#718096',
      marginTop: '4px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Add New Instructor</h1>
        </div>
        
        <div style={styles.requiredNote}>
          <span style={styles.infoIcon}>ℹ️</span>
          All fields are required.
        </div>

        {showSuccess && (
          <div style={styles.successMessage}>
            <span style={styles.successIcon}>✅</span>
            Instructor has been added successfully. Redirecting...
          </div>
        )}

        {apiError && (
          <div style={styles.errorMessage}>
            <span style={styles.errorIcon}>⚠️</span>
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={{...styles.formGroup, ...styles.fullWidth}}>
              <label style={styles.label}>
                Full Name <span style={styles.asterisk}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter full name"
              />
              {errors.name && <p style={styles.fieldError}>{errors.name}</p>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Email Address <span style={styles.asterisk}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter email address"
              />
              {errors.email && <p style={styles.fieldError}>{errors.email}</p>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Contact Number <span style={styles.asterisk}>*</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter 10-digit contact number"
                maxLength={10}
              />
              {errors.contactNumber && <p style={styles.fieldError}>{errors.contactNumber}</p>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Department <span style={styles.asterisk}>*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Department</option>
                <option value="Human Resource Management">Human Resource Management</option>
                <option value="Business Administration">Business Administration</option>
                <option value="English">English</option>
                <option value="Internal Sales & Marketing">Internal Sales & Marketing</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Accounting">Accounting</option>
              </select>
              {errors.department && <p style={styles.fieldError}>{errors.department}</p>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Assigned Course (ID) <span style={styles.asterisk}>*</span>
              </label>
              <select
                name="assignedCourse"
                value={formData.assignedCourse}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Course</option>
                {availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.id} - {course.name}
                  </option>
                ))}
              </select>
              {errors.assignedCourse && <p style={styles.fieldError}>{errors.assignedCourse}</p>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Password <span style={styles.asterisk}>*</span>
              </label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.passwordInput}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <div style={styles.passwordStrengthInfo}>
                At least 8 characters with letters and numbers
              </div>
              {errors.password && <p style={styles.fieldError}>{errors.password}</p>}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Confirm Password <span style={styles.asterisk}>*</span>
              </label>
              <div style={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={styles.passwordInput}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.confirmPassword && <p style={styles.fieldError}>{errors.confirmPassword}</p>}
            </div>
          </div>
          
          <div style={styles.buttonContainer}>
            <button 
              type="button" 
              style={styles.cancelButton}
              onClick={() => navigate('/allinstrutors')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitButton,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Instructor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InstructorForm;