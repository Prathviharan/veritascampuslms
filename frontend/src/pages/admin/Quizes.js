import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, FileText, FileSpreadsheet } from 'lucide-react';

const Quizes = () => {
  // Sample quiz data with date ranges for availability
  const [quizes] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals",
      availability: "May 1, 2025 - May 30, 2025",
      timeLimit: "30 minutes",
      totalMarks: 100,
      allowMultipleAttempts: "Yes",
      status: "Active"
    },
    {
      id: 2,
      title: "React Basics",
      availability: "May 5, 2025 - June 15, 2025",
      timeLimit: "45 minutes",
      totalMarks: 150,
      allowMultipleAttempts: "No",
      status: "Active"
    },
    {
      id: 3,
      title: "CSS Advanced Techniques",
      availability: "June 1, 2025 - June 30, 2025",
      timeLimit: "60 minutes",
      totalMarks: 120,
      allowMultipleAttempts: "Yes",
      status: "Upcoming"
    },
    {
      id: 4,
      title: "Node.js for Beginners",
      availability: "May 10, 2025 - July 10, 2025",
      timeLimit: "90 minutes",
      totalMarks: 200,
      allowMultipleAttempts: "No",
      status: "Active"
    },
    {
      id: 5,
      title: "Database Design Principles",
      availability: "April 1, 2025 - April 30, 2025",
      timeLimit: "75 minutes",
      totalMarks: 180,
      allowMultipleAttempts: "Yes",
      status: "Expired"
    }
  ]);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [attemptsFilter, setAttemptsFilter] = useState('All');

  // Get unique values for filter options
 
  const statuses = ['All', ...new Set(quizes.map(quiz => quiz.status))];
  const attemptOptions = ['All', 'Yes', 'No'];

  // Filtered quizzes based on search and filters
  const filteredQuizes = useMemo(() => {
    return quizes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || quiz.status === statusFilter;
      const matchesAttempts = attemptsFilter === 'All' || quiz.allowMultipleAttempts === attemptsFilter;

      return matchesSearch  && matchesStatus && matchesAttempts;
    });
  }, [quizes, searchTerm , statusFilter, attemptsFilter]);

  // Generate CSV content
  const generateCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Difficulty', 'Status', 'Availability', 'Time Limit', 'Total Marks', 'Allow Multiple Attempts'];
    const csvContent = [
      headers.join(','),
      ...filteredQuizes.map(quiz => [
        quiz.id,
        `"${quiz.title}"`,
        quiz.status,
        `"${quiz.availability}"`,
        `"${quiz.timeLimit}"`,
        quiz.totalMarks,
        quiz.allowMultipleAttempts
      ].join(','))
    ].join('\n');

    return csvContent;
  };

  // Download CSV file
  const downloadCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'quizzes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate PDF content (simplified HTML for PDF)
  const generatePDF = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quiz Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2c3e50; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #3498db; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .summary { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Quiz Management Report</h1>
          <div class="summary">
            <h3>Summary</h3>
            <p>Total Quizzes: ${filteredQuizes.length}</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                
                <th>Status</th>
                <th>Availability</th>
                <th>Time Limit</th>
                <th>Total Marks</th>
                <th>Multiple Attempts</th>
              </tr>
            </thead>
            <tbody>
              ${filteredQuizes.map(quiz => `
                <tr>
                  <td>${quiz.id}</td>
                  <td>${quiz.title}</td>
                  <td>${quiz.status}</td>
                  <td>${quiz.availability}</td>
                  <td>${quiz.timeLimit}</td>
                  <td>${quiz.totalMarks}</td>
                  <td>${quiz.allowMultipleAttempts}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'quizzes-report.html');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setAttemptsFilter('All');
  };

  // CSS styles (internal)
  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#2c3e50',
    },
    controlsContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '20px',
    },
    searchInput: {
      width: '100%',
      padding: '12px 45px 12px 15px',
      border: '2px solid #e0e0e0',
      borderRadius: '6px',
      fontSize: '16px',
      outline: 'none',
    },
    searchIcon: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#666',
    },
    filtersContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px',
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    filterLabel: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#555',
    },
    filterSelect: {
      padding: '10px',
      border: '2px solid #e0e0e0',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
    },
    actionsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    button: {
      padding: '10px 16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
    },
    primaryButton: {
      backgroundColor: '#3498db',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
    },
    successButton: {
      backgroundColor: '#27ae60',
      color: 'white',
    },
    warningButton: {
      backgroundColor: '#f39c12',
      color: 'white',
    },
    resultsInfo: {
      fontSize: '16px',
      color: '#666',
      fontWeight: 'bold',
    },
    listContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    subheader: {
      color: '#3498db',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #ecf0f1',
    },
    tableContainer: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '1000px',
    },
    tableHeader: {
      backgroundColor: '#3498db',
      color: 'white',
      textAlign: 'left',
      padding: '15px',
      fontWeight: 'bold',
    },
    tableCell: {
      padding: '15px',
      borderBottom: '1px solid #ecf0f1',
    },
    tableRow: {
      transition: 'background-color 0.2s',
    },
    availabilityDate: {
      backgroundColor: '#e3f2fd',
      color: '#1565c0',
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 'normal',
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    statusActive: {
      backgroundColor: '#d4edda',
      color: '#155724',
    },
    statusUpcoming: {
      backgroundColor: '#fff3cd',
      color: '#856404',
    },
    statusExpired: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
    },
    difficultyBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    difficultyBeginner: {
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
    },
    difficultyIntermediate: {
      backgroundColor: '#ffeaa7',
      color: '#6c5ce7',
    },
    difficultyAdvanced: {
      backgroundColor: '#fab1a0',
      color: '#e17055',
    },
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return { ...styles.statusBadge, ...styles.statusActive };
      case 'Upcoming': return { ...styles.statusBadge, ...styles.statusUpcoming };
      case 'Expired': return { ...styles.statusBadge, ...styles.statusExpired };
      default: return styles.statusBadge;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Quiz Management System</h1>
      
      {/* Search and Filter Controls */}
      <div style={styles.controlsContainer}>
        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search quizzes by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <Search size={20} style={styles.searchIcon} />
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterSelect}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Multiple Attempts</label>
            <select
              value={attemptsFilter}
              onChange={(e) => setAttemptsFilter(e.target.value)}
              style={styles.filterSelect}
            >
              {attemptOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionsContainer}>
          <div style={styles.resultsInfo}>
            Showing {filteredQuizes.length} of {quizes.length} quizzes
          </div>
          
          <div style={styles.buttonGroup}>
            <button
              onClick={clearFilters}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              <Filter size={16} />
              Clear Filters
            </button>
            
            <button
              onClick={downloadCSV}
              style={{ ...styles.button, ...styles.successButton }}
            >
              <FileSpreadsheet size={16} />
              Export Excel
            </button>
            
            <button
              onClick={generatePDF}
              style={{ ...styles.button, ...styles.warningButton }}
            >
              <FileText size={16} />
              Export PDF
            </button>
          </div>
        </div>
      </div>
      
      {/* Quiz Table */}
      <div style={styles.listContainer}>
        <h2 style={styles.subheader}>Quizzes List</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Title</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Availability</th>
                <th style={styles.tableHeader}>Time Limit</th>
                <th style={styles.tableHeader}>Total Marks</th>
                <th style={styles.tableHeader}>Multiple Attempts</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizes.length > 0 ? (
                filteredQuizes.map((quiz) => (
                  <tr 
                    key={quiz.id} 
                    style={styles.tableRow}
                    onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}
                  >
                    <td style={styles.tableCell}>{quiz.id}</td>
                    <td style={styles.tableCell}>
                      <strong>{quiz.title}</strong>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={getStatusStyle(quiz.status)}>
                        {quiz.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.availabilityDate}>
                        {quiz.availability}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{quiz.timeLimit}</td>
                    <td style={styles.tableCell}>{quiz.totalMarks}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        color: quiz.allowMultipleAttempts === 'Yes' ? '#27ae60' : '#e74c3c',
                        fontWeight: 'bold'
                      }}>
                        {quiz.allowMultipleAttempts}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{...styles.tableCell, textAlign: 'center', padding: '40px'}}>
                    <div style={{color: '#666', fontSize: '18px'}}>
                      No quizzes found matching your criteria
                    </div>
                    <button
                      onClick={clearFilters}
                      style={{...styles.button, ...styles.primaryButton, marginTop: '15px'}}
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Quizes;