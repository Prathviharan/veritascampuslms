import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/courses.css';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/adminCourseStats/stats');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/adminCourseStats/stats/${id}`);
      alert("Course deleted successfully.");
      fetchCourses();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete course.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="courses-page">
      <h2 className="courses-title">Courses</h2>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <>
          <div className="button-container">
            <Link to="/admin/courses/add">
              <button className="btn-add-new">+ Add New Course</button>
            </Link>
          </div>

          <table className="courses-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>No. of Instructors</th>
                <th>No. of Students</th>
                <th>No. of Modules</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No courses found.</td>
                </tr>
              ) : (
                courses.map(course => (
                  <tr key={course._id}>
                    <td>
                      <Link to={`/admin/courses/${course._id}`} className="course-link">
                        {course.title}
                      </Link>
                    </td>
                    <td>{course.instructorCount}</td>
                    <td>{course.numStudents ?? 0}</td>
                    <td>{course.numModules ?? 0}</td>
                    <td>
                      <Link to={`/admin/courses/edit/${course._id}`} className="btn-edit" title="Edit Course">✏️</Link>
                      <button onClick={() => handleDeleteClick(course._id)} className="btn-delete" title="Delete Course">🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CoursesPage;
