import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../css/adminDashboard.css';
import adminIcon from '../../assets/admin.png';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#FF8042'];

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [popularCourses, setPopularCourses] = useState([]);
  const [revisionData, setRevisionData] = useState([]);
  const [courseProgressData, setCourseProgressData] = useState([
    { name: 'Completed', value: 0 },
    { name: 'Incomplete', value: 100 }
  ]);

  // Fetch overview, popular courses, and course progress
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/adminDashboard/dash');
        setOverview(res.data.overview || {});
        setPopularCourses(res.data.popularCourses || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    const fetchCourseProgress = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/adminDashboard/progress');
        setCourseProgressData([
          { name: 'Completed', value: res.data.completed },
          { name: 'Incomplete', value: res.data.incomplete }
        ]);
      } catch (error) {
        console.error('Error fetching course progress:', error);
      }
    };

    fetchDashboardData();
    fetchCourseProgress();
  }, []);

  // Fetch recent revision activities
  useEffect(() => {
    const fetchRevisionData = async () => {
      try {
        const [
          courseRes, assignmentRes, assignmentSubmissionRes, changesRes, entrollRes,
          instructorRes, studentRes, examRes, instrucorSupRes, lectureMRes,
          quizeRes, studentSupRes, lectureRes, quizeSubmitionRes
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/adminReport/courseRevisions"),
          axios.get("http://localhost:5000/api/adminReport/assignment"),
          axios.get("http://localhost:5000/api/adminReport/assignmentSubmission"),
          axios.get("http://localhost:5000/api/adminReport/changes"),
          axios.get("http://localhost:5000/api/adminReport/entroll"),
          axios.get("http://localhost:5000/api/adminReport/instructor"),
          axios.get("http://localhost:5000/api/adminReport/student"),
          axios.get("http://localhost:5000/api/adminReport/exam"),
          axios.get("http://localhost:5000/api/adminReport/instrucorSup"),
          axios.get("http://localhost:5000/api/adminReport/lectureM"),
          axios.get("http://localhost:5000/api/adminReport/quize"),
          axios.get("http://localhost:5000/api/adminReport/studentSup"),
          axios.get("http://localhost:5000/api/adminReport/lecture"),
          axios.get("http://localhost:5000/api/adminReport/quizeSubmition")
        ]);

        const courseData = courseRes.data.map(course => ({
          description: `Course "${course.title}" was revised.`
        }));

        const assignmentData = assignmentRes.data.map(assignment => ({
          description: `Assignment "${assignment.title}" was updated.`
        }));

        const assignmentSubmissionData = assignmentSubmissionRes.data.map(submission => ({
          description: `Assignment "${submission.title}" was submitted.`
        }));

        const changesData = changesRes.data.map(changes => ({
          description: `Password "${changes.title}" changed.`
        }));

        const entrollData = entrollRes.data.map(() => ({
          description: `Student enrolled in course.`
        }));

        const instructorData = instructorRes.data.map(() => ({
          description: `Instructor logged in.`
        }));

        const studentData = studentRes.data.map(() => ({
          description: `Student logged in.`
        }));

        const examData = examRes.data.map(() => ({
          description: `Exam was updated.`
        }));

        const instrucorSupData = instrucorSupRes.data.map(() => ({
          description: `Instructor sent support request to admin.`
        }));

        const lectureMData = lectureMRes.data.map(() => ({
          description: `Lecture material was updated.`
        }));

        const quizeData = quizeRes.data.map(quize => ({
          description: `"${quize.title}" quiz was updated.`
        }));

        const studentSupData = studentSupRes.data.map(() => ({
          description: `Student sent support request to admin.`
        }));

        const lectureData = lectureRes.data.map(() => ({
          description: `Lecture was updated.`
        }));

        const quizeSubmitionData = quizeSubmitionRes.data.map(() => ({
          description: `Quiz was submitted.`
        }));

        const combined = [
          ...courseData, ...assignmentData, ...assignmentSubmissionData,
          ...changesData, ...entrollData, ...instructorData, ...studentData,
          ...examData, ...instrucorSupData, ...lectureMData, ...quizeData,
          ...studentSupData, ...lectureData, ...quizeSubmitionData
        ];

        setRevisionData(combined);
      } catch (err) {
        console.error("Error loading revision data", err);
      }
    };

    fetchRevisionData();
  }, []);

  return (
    <div className="admin-dashboard">
    
      <div className="dashboard-main">
        <h3>Quick Overview</h3>
        <div className="dashboard-top">
          <div className="quick-overview">
            <div className="overview-box">Total Courses: {overview.totalCourses || 0}</div>
            <div className="overview-box">Total Instructors: {overview.totalInstructors || 0}</div>
            <div className="overview-box">Total Students: {overview.totalStudents || 0}</div>
            <div className="overview-box">Total Exams: {overview.totalExams || 0}</div>
            <div className="overview-box">Total Quizzes: {overview.totalQuizzes || 0}</div>
            <div className="overview-box">Total Certificates: {overview.totalCertificates || 0}</div>
          </div>
          <div className="admin-profile">
            <img src={adminIcon} alt="Admin" className="admin-icon" />
            <p className="admin-label">Admin</p>
          </div>
        </div>

        <div className="popular-progress-row">
          <div className="popular-section">
            <h3>Most Popular Courses</h3>
            {popularCourses.length === 0 ? (
              <p>No popular courses found.</p>
            ) : (
              <ul>
                {popularCourses.map((course, index) => (
                  <li key={index}>
                    <div><strong>{course.users} Users</strong></div>
                    <div><span>{course.title}</span></div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="course-progress">
            <h3>Course Progress</h3>
            <PieChart width={300} height={250}>
              <Pie
                data={courseProgressData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {courseProgressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        <div className="recent-activities">
          <h3>Recent Activities</h3>
          {revisionData.length === 0 ? (
            <p>No recent activities available.</p>
          ) : (
            <ul>
              {revisionData.map((activity, index) => (
                <li key={index}>{activity.description}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
