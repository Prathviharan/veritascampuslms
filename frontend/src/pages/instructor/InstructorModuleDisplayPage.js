import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../css/InstructorModuleDisplayPage.css';

const InstructorModuleDisplayPage = () => {
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLectureMaterial, setNewLectureMaterial] = useState({ title: '', description: '', url: '' });
  const [openWeeks, setOpenWeeks] = useState({});
  const [openContentTypes, setOpenContentTypes] = useState({});

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/instructor/modules/${moduleId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setModule(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  const handleAddContent = async (contentType, content) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/instructor/modules/${moduleId}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, content }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add ${contentType}`);
      }

      const updatedModule = await response.json();
      setModule(updatedModule);
      if (contentType === 'lectureMaterials') {
        setNewLectureMaterial({ title: '', description: '', url: '' });
      }
    } catch (error) {
      console.error(`Error adding ${contentType}:`, error);
      setError(error.message);
    }
  };

  const handleAddLectureMaterialSubmit = (e) => {
    e.preventDefault();
    handleAddContent('lectureMaterials', newLectureMaterial);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/instructor/assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete assignment');
      }

      const updated = await fetch(`${API_BASE_URL}/api/instructor/modules/${moduleId}`);
      const data = await updated.json();
      setModule(data);
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
    }
  };

  const toggleWeek = (week) => {
    setOpenWeeks(prev => ({ ...prev, [week]: !prev[week] }));
  };

  const toggleContentType = (week, type) => {
    const key = `${week}-${type}`;
    setOpenContentTypes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Error: {error.message}</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Module not found</div>
      </div>
    );
  }

  const weeks = Array.from({ length: 8 }, (_, i) => i + 1); // 1 to 8

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/programmes">Programmes</Link></li>
          <li className="breadcrumb-item"><Link to="#">Diploma Programmes</Link></li>
          <li className="breadcrumb-item"><Link to="#">Management & Business Studies</Link></li>
          <li className="breadcrumb-item"><Link to="/instructor/years">Year Display</Link></li>
          <li className="breadcrumb-item"><Link to="/instructor/semesters">Semester Display</Link></li>
          <li className="breadcrumb-item active">{module.title}</li>
        </ol>
      </nav>

      <h1>{module.title}</h1>
      <p>{module.description}</p>

      {weeks.map((week) => (
        <div key={week} className="week-section mt-4">
          <h3 onClick={() => toggleWeek(week)} style={{ cursor: 'pointer' }}>
            Week {week} {openWeeks[week] ? '▼' : '►'}
          </h3>

          {openWeeks[week] && (
            <div className="content-types-container">

              {/* Lecture Materials */}
              <div className="module-section">
                <h4 onClick={() => toggleContentType(week, 'lectureMaterials')} style={{ cursor: 'pointer' }}>
                  Lecture Materials {openContentTypes[`${week}-lectureMaterials`] ? '▼' : '►'}
                </h4>

                {openContentTypes[`${week}-lectureMaterials`] && (
                  <>
                    <a href="/instructor/add-lecture-material/:courseId" className="btn btn-success">Add New Lecture Materials</a>
                    <h5>Existing Materials</h5>
                    {module.lectureMaterials?.length > 0 ? (
                      <ul>
                        {module.lectureMaterials.map(item => (
                          <li key={item._id}>
                            <strong>{item.title}</strong> - {item.description}
                            {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer"> [Link]</a>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-muted">No lecture materials added yet.</div>
                    )}
                  </>
                )}
              </div>

              {/* Assignments */}
              <div className="module-section">
                <h4 onClick={() => toggleContentType(week, 'assignments')} style={{ cursor: 'pointer' }}>
                  Assignments {openContentTypes[`${week}-assignments`] ? '▼' : '►'}
                </h4>

                {openContentTypes[`${week}-assignments`] && (
                  <div>
                    {module.assignments?.length > 0 ? (
                      <ul>
                        {module.assignments.map((assignment) => (
                          <li key={assignment._id} className="mb-2 border p-2">
                            <strong>{assignment.title}</strong><br />
                            {assignment.description && <small>{assignment.description}</small>}<br />
                            {assignment.deadline && <small>Due: {new Date(assignment.deadline).toLocaleDateString()}</small>}
                            <div className="mt-2">
                              <Link to={`/instructor/assignments/${assignment._id}/performance`} className="btn btn-info btn-sm me-2">View Performance</Link>
                              <Link to={`/instructor/modules/${moduleId}/assignments/${assignment._id}/edit`} className="btn btn-secondary btn-sm me-2">Edit</Link>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAssignment(assignment._id)}>Delete</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>
                        <p>No assignments added yet.</p>
                        <Link to={`/instructor/modules/${moduleId}/assignments/add`} className="btn btn-success btn-sm">Add Assignment</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quizzes */}
              <div className="module-section">
                <h4 onClick={() => toggleContentType(week, 'quizzes')} style={{ cursor: 'pointer' }}>
                  Quizzes {openContentTypes[`${week}-quizzes`] ? '▼' : '►'}
                </h4>
                {openContentTypes[`${week}-quizzes`] && (
                  <div>
                    {module.quizzes?.length > 0 ? (
                      <ul>
                        {module.quizzes.map((quiz) => (
                          <li key={quiz._id}><strong>{quiz.title}</strong> - {quiz.description}</li>
                        ))}
                      </ul>
                    ) : (
                      <div>
                        <p>No quizzes created yet.</p>
                        <Link to="/instructor/addquiz" className="btn btn-success btn-sm">Create Quiz</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Announcements */}
              <div className="module-section">
                <h4 onClick={() => toggleContentType(week, 'announcements')} style={{ cursor: 'pointer' }}>
                  Announcements {openContentTypes[`${week}-announcements`] ? '▼' : '►'}
                </h4>
                {openContentTypes[`${week}-announcements`] && (
                  <div>
                    {module.announcements?.length > 0 ? (
                      <ul>
                        {module.announcements.map((a) => (
                          <li key={a._id}><strong>{a.title}</strong>: {a.message}</li>
                        ))}
                      </ul>
                    ) : (
                      <div>
                        <p>No announcements yet.</p>
                        <Link to="/addannouncement" className="btn btn-success btn-sm">Add Announcement</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InstructorModuleDisplayPage;
