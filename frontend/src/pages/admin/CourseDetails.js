import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/course.css';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/adminCourseStats/details/${id}`);
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
        alert('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!courseData) return <p>No data found.</p>;

  const { course, materials, assignments, quizzes, exams } = courseData;

  return (
    <div className="course-details-container">
      <h2>{course.title}</h2>

      <div className="section">
        <h5>Instructors:</h5>
        <ul>
          {Array.isArray(course.instructor) && course.instructor.length > 0 ? (
            course.instructor.map((inst, i) => <li key={i}>{inst}</li>)
          ) : (
            <li>No instructors listed</li>
          )}
        </ul>
      </div>

      <div className="course-details-layout">
        <div className="coursed-row">
          <div className="coursed-column section">
            <h5>Lecture Materials:</h5>
            {materials?.length > 0 ? (
              <ul>
                {materials.map((material) => (
                  <li key={material._id}>{material.title}</li>
                ))}
              </ul>
            ) : (
              <p>No materials available.</p>
            )}
          </div>

          <div className="coursed-column section">
            <h5>Assignments:</h5>
            {assignments?.length > 0 ? (
              <ul>
                {assignments.map((assignment) => (
                  <li key={assignment._id}>{assignment.title}</li>
                ))}
              </ul>
            ) : (
              <p>No assignments available.</p>
            )}
          </div>
        </div>

        <div className="coursed-row">
          <div className="coursed-column section">
            <h5>Quizzes:</h5>
            {quizzes?.length > 0 ? (
              <ul>
                {quizzes.map((quiz) => (
                  <li key={quiz._id}>{quiz.title}</li>
                ))}
              </ul>
            ) : (
              <p>No quizzes available.</p>
            )}
          </div>

          <div className="coursed-column section">
            <h5>Exams:</h5>
            {exams?.length > 0 ? (
              <ul>
                {exams.map((exam) => (
                  <li key={exam._id}>{exam.title}</li>
                ))}
              </ul>
            ) : (
              <p>No exams available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
