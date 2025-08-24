import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList, Cell
} from 'recharts';
import '../../css/ReportsPage.css';
import Sidebar from '../../components/Sidebar';
import axios from "axios";
import { MdDownload } from "react-icons/md";
import html2pdf from 'html2pdf.js';

export default function ReportsPage() {
  const [mergedData, setMergedData] = useState([]);
  const [revisionData, setRevisionData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All Dates");

  // Fetch login stats
  useEffect(() => {
    axios.get("http://localhost:5000/api/adminReport/logins")
      .then(res => setMergedData(res.data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // Fetch course, assignment, and submission changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, assignmentRes, assignmentSubmissionRes, changesRes, entrollRes, instructorRes, studentRes,examRes,instrucorSupRes,lectureMRes,quizeRes,studentSupRes,lectureRes,quizeSubmitionRes] = await Promise.all([
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
          id: course._id,
          type: "Course",
          title: course.title,
          description: `Course "${course.title}" was revised.`,
          user: course.instructor||"-" ,
          role: course.updatedBy ? "Instructor" : "Admin",
          updatedAt: course.updatedAt || course.createdAt
        }));

        const assignmentData = assignmentRes.data.map(assignment => ({
          id: assignment._id,
          type: "Assignment",
          title: assignment.title,
          description: `Assignment "${assignment.title}" was updated.`,
          user: assignment.name ||"-",
          role: assignment.updatedBy ? "Instructor" : "Instructor",
          updatedAt: assignment.updatedAt || assignment.createdAt
        }));

        const assignmentSubmissionData = assignmentSubmissionRes.data.map(submission => ({
          id: submission._id,
          type: "Assignment Submission",
          title: submission.title,
          description: `Assignment "${submission.title}" was submitted.`,
          user: submission.studentName||"-",
          role: submission.updatedBy ? "Student" : "Student",
          updatedAt: submission.updatedAt || submission.createdAt
        }));

        const changesData = changesRes.data.map(changes => ({
          id: changes._id,
          type: "Password changed",
          title: changes.title,
          description: `Password "${changes.title}" Change.`,
          user: changes.name||"-",
          role: changes.updatedBy ? "Student" : "Student",
          updatedAt: changes.updatedAt || changes.createdAt
        }));

        const entrollData = entrollRes.data.map(entroll => ({
          id: entroll._id,
          type: "Entrolled in Course",
          title: entroll.title,
          description: `Entrolled in course.`,
          user: entroll.name||"-",
          role: entroll.updatedBy ? "Student" : "Student",
          updatedAt: entroll.updatedAt || entroll.createdAt
        }));

        const instructorData = instructorRes.data.map(instructor => ({
          id: instructor._id,
          type: "Instructor logged in",
          title: instructor.title,
          description: `Instructor logged in.`,
          role: instructor.updatedBy ? "Instructor" : "Instructor",
          user: instructor.firstName ||"-",
          updatedAt: instructor.updatedAt || instructor.createdAt
        }));

        const studentData = studentRes.data.map(student => ({
          id: student._id,
          type: "Student logged in",
          title: student.title,
          description: `Student logged in.`,
          user: student.name||"-" ,
          role: student.updatedBy ? "Student" : "Student",
          updatedAt: student.updatedAt || student.createdAt
        }));

         const examData = examRes.data.map(exam => ({
          id: exam._id,
          type: "exam",
          title: exam.title,
          description: `Exam was upadated`,
          user: exam.name||"-" ,
          role: exam.updatedBy ? "Instructor" : "Instructor",
          updatedAt: exam.updatedAt || exam.createdAt
        }));

        const instrucorSupData = instrucorSupRes.data.map(instrucorSup => ({
          id: instrucorSup._id,
          type: "instructorSup",
          title: instrucorSup.title,
          description: `Istructor send support request for admin `,
          user: instrucorSup.name||"-" ,
          role: instrucorSup.updatedBy ? "Instructor" : "Instructor",
          updatedAt: instrucorSup.updatedAt || instrucorSup.createdAt
        }));

        const lectureMData = lectureMRes.data.map(lectureM => ({
          id: lectureM._id,
          type: "lectureM",
          title: lectureM.title,
          description: `Lecture material was upadated`,
          user: lectureM.lectureName||"-" ,
          role: lectureM.updatedBy ? "Instructor" : "Instructor",
          updatedAt: lectureM.updatedAt || lectureM.createdAt
        }));

         const quizeData = quizeRes.data.map(quize => ({
          id: quize._id,
          type: "quize",
          title: quize.title,
          description: `"${quize.title}" qiuze was upadated`,
          user: quize.name||"-" ,
          role: quize.updatedBy ? "Instructor" : "Instructor",
          updatedAt: quize.updatedAt || quize.createdAt
        }));

        const studentSupData = studentSupRes.data.map(studentSup => ({
          id: studentSup._id,
          type: "studentSup",
          title: studentSup.title,
          description: `Student send support request for admin`,
          user: studentSup.studentName||"-" ,
          role: studentSup.updatedBy ? "Student" : "Student",
          updatedAt: studentSup.updatedAt || studentSup.createdAt
        }));

        const lectureData = lectureRes.data.map(lecture => ({
          id: lecture._id,
          type: "lecture",
          title: lecture.title,
          description: `Lectures was updated`,
          user: lecture.studentName||"-" ,
          role: lecture.updatedBy ? "Instructor" : "Instructor",
          updatedAt: lecture.updatedAt || lecture.createdAt
        }));

        const quizeSubmitionData = quizeSubmitionRes.data.map(quizeSubmition => ({
          id: quizeSubmition._id,
          type: "quizesubmition",
          title: quizeSubmition.title,
          description: `Quize was Submited`,
          user: quizeSubmition.studentName||"-" ,
          role: quizeSubmition.updatedBy ? "Student" : "Student",
          updatedAt: quizeSubmition.updatedAt || quizeSubmition.createdAt
        }));

        const combined = [...courseData, ...assignmentData, ...assignmentSubmissionData, ...changesData, ...entrollData, ...instructorData, ...studentData, ...examData, ...instrucorSupData, ...lectureMData,...quizeData, ...studentSupData, ...lectureData, ...quizeSubmitionData ].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setRevisionData(combined);
      } catch (err) {
        console.error("Error loading revision data", err);
      }
    };

    fetchData();
  }, []);

  // Date range filter logic
  const isWithinDateRange = (dateStr) => {
    const today = new Date();
    const entryDate = new Date(dateStr);

    if (dateFilter === "Last 7 Days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      return entryDate >= sevenDaysAgo;
    } else if (dateFilter === "Last 30 Days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    }
    return true;
  };

  // Filter login stats
  const filteredData = mergedData.filter(item =>
    (
      item.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student?.toString().includes(searchTerm) ||
      item.instructor?.toString().includes(searchTerm) ||
      item.enrollments?.toString().includes(searchTerm) ||
      item.passwordChanges?.toString().includes(searchTerm) ||
      item.courses?.toString().includes(searchTerm)
    ) &&
    isWithinDateRange(item.date)
  );

  // Filter revision logs with date range
  const filteredRevisionData = revisionData.filter(rev =>
    (
      
      rev.user?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.title?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.description?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(rev.updatedAt).toLocaleDateString().includes(searchTerm)
    ) &&
    isWithinDateRange(rev.updatedAt)
  );

  const totals = filteredData.reduce((acc, item) => {
    acc.students += item.student || 0;
    acc.instructors += item.instructor || 0;
    acc.enrollments += item.enrollments || 0;
    acc.passwordChanges += item.passwordChanges || 0;
    acc.courses += item.courses || 0;
    return acc;
  }, { students: 0, instructors: 0, enrollments: 0, passwordChanges: 0, courses: 0 });

  const chartData = [
    { name: "Students Logins", value: totals.students, fill: "#1D4ED8" },
    { name: "Instructors Logins", value: totals.instructors, fill: "#60A5FA" },
    { name: "Enrollments", value: totals.enrollments, fill: "#b4f139" },
    { name: "User Changes", value: totals.passwordChanges, fill: "#9CA3AF" },
    { name: "Courses Updated", value: totals.courses, fill: "#F97316" }
  ];

  const downloadPageAsPDF = () => {
    const element = document.getElementById('download-section');
    html2pdf().from(element).save('Reports & Analytics.pdf');
  };

  return (
    <div className="admin-Report-container">
     
      <div className="reports-page" id="download-section">
        <h1 className="title">Reports and Analytics</h1>

        {/* Filters */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search anything..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="asearch-input"
          />
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className='select'>
            <option>All Dates</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
          <button className="dbtn" onClick={downloadPageAsPDF}>
            <MdDownload size={17} style={{ verticalAlign: "middle" }} /> Download Report
          </button>
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <ResponsiveContainer width="70%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Activity Log */}
        <div className="table-section">
          <h2 className="table-title">User Activity Logs</h2>
          <table className='rtable'>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Role</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRevisionData.map(rev => (
                <tr key={rev.id}>
                  <td>{rev.user}</td>
                  <td>{rev.role}</td>
                  <td>{rev.description}</td>
                  <td>{new Date(rev.updatedAt || rev.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Course Revision History */}
        <div className="table-section">
          <h2 className="table-title">Course Revision History</h2>
          <table className='rtable'>
            <thead>
              <tr>
                <th>Course</th>
                <th>Update By</th>
                <th>Changes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRevisionData.filter(rev => rev.type === "Course" || rev.type === "Assignment"|| rev.type === "exam"||rev.type === "lectureM"||rev.type === "quize"||rev.type === "lecture"||rev.type === "quizesubmition").map(rev => (
                <tr key={rev.id}>
                  <td>{rev.title}</td>
                  <td>{rev.role}</td>
                  <td>{rev.description}</td>
                  <td>{new Date(rev.updatedAt || rev.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}  