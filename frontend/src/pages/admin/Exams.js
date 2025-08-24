import React, { useState, useMemo } from 'react';
import { Search, Filter, FileText, Download, Calendar, Clock, X } from 'lucide-react';

function Exams() {
  // Enhanced sample data for the exams
  const [exams] = useState([
    { 
      id: 1,
      date: '22.04.2024', 
      name: 'Mathematics Final', 
      startTime: '10:00 A.M', 
      endTime: '12:00 P.M', 
      duration: '120mins',
      semester: 'Semester 1',
      subject: 'Mathematics',
      type: 'Final',
      status: 'Upcoming',
      venue: 'Hall A'
    },
    { 
      id: 2,
      date: '23.04.2024', 
      name: 'Physics Midterm', 
      startTime: '02:00 P.M', 
      endTime: '04:00 P.M', 
      duration: '120mins',
      semester: 'Semester 2',
      subject: 'Physics',
      type: 'Midterm',
      status: 'Upcoming',
      venue: 'Lab B'
    },
    { 
      id: 3,
      date: '25.04.2024', 
      name: 'Chemistry Lab Test', 
      startTime: '09:00 A.M', 
      endTime: '10:30 A.M', 
      duration: '90mins',
      semester: 'Semester 1',
      subject: 'Chemistry',
      type: 'Lab Test',
      status: 'Upcoming',
      venue: 'Lab C'
    },
    { 
      id: 4,
      date: '28.04.2024', 
      name: 'Biology Final', 
      startTime: '11:00 A.M', 
      endTime: '01:00 P.M', 
      duration: '120mins',
      semester: 'Semester 2',
      subject: 'Biology',
      type: 'Final',
      status: 'Upcoming',
      venue: 'Hall B'
    },
    { 
      id: 5,
      date: '30.04.2024', 
      name: 'English Literature', 
      startTime: '03:00 P.M', 
      endTime: '04:00 P.M', 
      duration: '60mins',
      semester: 'Semester 1',
      subject: 'English',
      type: 'Quiz',
      status: 'Completed',
      venue: 'Room 101'
    },
    { 
      id: 6,
      date: '02.05.2024', 
      name: 'Computer Science Final', 
      startTime: '10:00 A.M', 
      endTime: '12:30 P.M', 
      duration: '150mins',
      semester: 'Semester 2',
      subject: 'Computer Science',
      type: 'Final',
      status: 'Upcoming',
      venue: 'Computer Lab'
    },
    { 
      id: 7,
      date: '05.05.2024', 
      name: 'History Midterm', 
      startTime: '01:00 P.M', 
      endTime: '02:30 P.M', 
      duration: '90mins',
      semester: 'Semester 1',
      subject: 'History',
      type: 'Midterm',
      status: 'Postponed',
      venue: 'Room 205'
    }
  ]);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Get unique values for filter options
  const semesters = ['All', ...new Set(exams.map(exam => exam.semester))];
  const subjects = ['All', ...new Set(exams.map(exam => exam.subject))];
  const types = ['All', ...new Set(exams.map(exam => exam.type))];
  const statuses = ['All', ...new Set(exams.map(exam => exam.status))];

  // Filtered exams based on search and filters
  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSemester = semesterFilter === 'All' || exam.semester === semesterFilter;
      const matchesSubject = subjectFilter === 'All' || exam.subject === subjectFilter;
      const matchesType = typeFilter === 'All' || exam.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || exam.status === statusFilter;

      return matchesSearch && matchesSemester && matchesSubject && matchesType && matchesStatus;
    });
  }, [exams, searchTerm, semesterFilter, subjectFilter, typeFilter, statusFilter]);

  // Generate CSV content
  const generateCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Subject', 'Semester', 'Type', 'Status', 'Start Time', 'End Time', 'Duration', 'Venue'];
    const csvContent = [
      headers.join(','),
      ...filteredExams.map(exam => [
        exam.id,
        `"${exam.date}"`,
        `"${exam.name}"`,
        exam.subject,
        `"${exam.semester}"`,
        exam.type,
        exam.status,
        `"${exam.startTime}"`,
        `"${exam.endTime}"`,
        exam.duration,
        `"${exam.venue}"`
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
    link.setAttribute('download', 'exams-report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate HTML report
  const generateHTMLReport = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Exam Schedule Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
            }
            .header { 
              text-align: center; 
              color: #3498db; 
              border-bottom: 3px solid #3498db;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .summary { 
              background-color: #f8f9fa; 
              padding: 20px; 
              border-radius: 8px; 
              margin-bottom: 30px;
              border-left: 4px solid #3498db;
            }
            .summary h3 {
              margin-top: 0;
              color: #3498db;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px; 
              text-align: left; 
            }
            th { 
              background-color: #3498db; 
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) { 
              background-color: #f8f9fa; 
            }
            tr:hover {
              background-color: #e3f2fd;
            }
            .status-badge {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            .status-upcoming { background-color: #fff3cd; color: #856404; }
            .status-completed { background-color: #d4edda; color: #155724; }
            .status-postponed { background-color: #f8d7da; color: #721c24; }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📚 Exam Schedule Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="summary">
            <h3>📊 Report Summary</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div><strong>Total Exams:</strong> ${filteredExams.length}</div>
              <div><strong>Upcoming:</strong> ${filteredExams.filter(e => e.status === 'Upcoming').length}</div>
              <div><strong>Completed:</strong> ${filteredExams.filter(e => e.status === 'Completed').length}</div>
              <div><strong>Postponed:</strong> ${filteredExams.filter(e => e.status === 'Postponed').length}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Exam Name</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Status</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              ${filteredExams.map(exam => `
                <tr>
                  <td>${exam.date}</td>
                  <td><strong>${exam.name}</strong></td>
                  <td>${exam.subject}</td>
                  <td>${exam.type}</td>
                  <td><span class="status-badge status-${exam.status.toLowerCase()}">${exam.status}</span></td>
                  <td>${exam.startTime} - ${exam.endTime}</td>
                  <td>${exam.duration}</td>
                  <td>${exam.venue}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report contains ${filteredExams.length} exam(s) based on applied filters.</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'exam-schedule-report.html');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSemesterFilter('All');
    setSubjectFilter('All');
    setTypeFilter('All');
    setStatusFilter('All');
    setDateFilter('All');
  };

  // Define styles as an object
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    },
    statsCard: {
      backgroundColor: '#5ba4c9',
      color: '#fff',
      borderRadius: '8px',
      padding: '15px 20px',
      width: '156px',
      marginBottom: '30px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    controlsContainer: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
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
      boxSizing: 'border-box',
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
    subheader: {
      color: '#3498db',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #ecf0f1',
    },
    tableContainer: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    },
    tableHeader: {
      display: 'flex',
      backgroundColor: '#e8f0f8',
      padding: '15px 0',
      fontWeight: '500',
      color: '#333',
      fontSize: '14px',
    },
    tableRow: {
      display: 'flex',
      borderBottom: '1px solid #eee',
      padding: '15px 0',
      transition: 'background-color 0.2s',
    },
    tableCell: {
      flex: 1,
      padding: '0 15px',
      color: '#333',
      fontSize: '14px',
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    statusUpcoming: {
      backgroundColor: '#fff3cd',
      color: '#856404',
    },
    statusCompleted: {
      backgroundColor: '#d4edda',
      color: '#155724',
    },
    statusPostponed: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
    },
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Upcoming': return { ...styles.statusBadge, ...styles.statusUpcoming };
      case 'Completed': return { ...styles.statusBadge, ...styles.statusCompleted };
      case 'Postponed': return { ...styles.statusBadge, ...styles.statusPostponed };
      default: return styles.statusBadge;
    }
  };

  return (
    <div style={styles.container}>
      {/* Stats Card */}
      <div style={styles.statsCard}>
        <div style={{ fontSize: '16px', marginBottom: '5px' }}>Total exams</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{filteredExams.length}</div>
      </div>

      {/* Search and Filter Controls */}
      <div style={styles.controlsContainer}>
        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search exams by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <Search size={20} style={styles.searchIcon} />
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Semester</label>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              style={styles.filterSelect}
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Subject</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              style={styles.filterSelect}
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={styles.filterSelect}
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

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
        </div>

        {/* Action Buttons */}
        <div style={styles.actionsContainer}>
          <div style={styles.resultsInfo}>
            Showing {filteredExams.length} of {exams.length} exams
          </div>
          
          <div style={styles.buttonGroup}>
            <button
              onClick={clearFilters}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              <X size={16} />
              Clear Filters
            </button>
            
            <button
              onClick={downloadCSV}
              style={{ ...styles.button, ...styles.successButton }}
            >
              <Download size={16} />
              Export CSV
            </button>
            
            <button
              onClick={generateHTMLReport}
              style={{ ...styles.button, ...styles.warningButton }}
            >
              <FileText size={16} />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <h2 style={styles.subheader}>Exams List</h2>

      {/* Exams Table */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <div style={styles.tableCell}>DATE</div>
          <div style={styles.tableCell}>NAME</div>
          <div style={styles.tableCell}>SUBJECT</div>
          <div style={styles.tableCell}>TYPE</div>
          <div style={styles.tableCell}>STATUS</div>
          <div style={styles.tableCell}>START TIME</div>
          <div style={styles.tableCell}>END TIME</div>
          <div style={styles.tableCell}>DURATION</div>
        </div>

        {filteredExams.length > 0 ? (
          filteredExams.map((exam, index) => (
            <div 
              key={exam.id} 
              style={styles.tableRow}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={styles.tableCell}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} color="#3498db" />
                  {exam.date}
                </div>
              </div>
              <div style={styles.tableCell}>
                <strong>{exam.name}</strong>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  {exam.semester}
                </div>
              </div>
              <div style={styles.tableCell}>{exam.subject}</div>
              <div style={styles.tableCell}>
                <span style={{
                  backgroundColor: '#e3f2fd',
                  color: '#1565c0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {exam.type}
                </span>
              </div>
              <div style={styles.tableCell}>
                <span style={getStatusStyle(exam.status)}>
                  {exam.status}
                </span>
              </div>
              <div style={styles.tableCell}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color="#27ae60" />
                  {exam.startTime}
                </div>
              </div>
              <div style={styles.tableCell}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color="#e74c3c" />
                  {exam.endTime}
                </div>
              </div>
              <div style={styles.tableCell}>
                <span style={{
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {exam.duration}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            ...styles.tableRow,
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#666', fontSize: '18px' }}>
              No exams found matching your criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Exams;