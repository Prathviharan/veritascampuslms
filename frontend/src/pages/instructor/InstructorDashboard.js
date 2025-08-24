import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InstructorDashboard = () => {
  const [data, setData] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/instructor/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error('Dashboard fetch error:', err));
  }, []);

  if (!data) return <p className="text-center mt-5">Loading Dashboard...</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-success fw-bold">
        Dashboard <span className="float-end">{time}</span>
      </h2>

      {/* My Schedule */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          Common Schedule
          <span className="float-end text-success">
            Date: {data.schedule?.length > 0 ? new Date(data.schedule[0].date).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr><th>Subject Code</th><th>Subject</th><th>Time</th><th>Location</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data.schedule && data.schedule.length > 0 ? (
                data.schedule.map((sch, i) => (
                  <tr key={i}>
                    <td>{sch.subjectCode || "N/A"}</td>
                    <td>{sch.subject || "N/A"}</td>
                    <td>{sch.time || "N/A"}</td>
                    <td>{sch.location || "N/A"}</td>
                    <td>{sch.status || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center">No schedule available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrolments and Quick Links side-by-side */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-light">Subject Enrolments</div>
            <ul className="list-group list-group-flush">
              {data.enrolments?.length > 0 ? (
                data.enrolments.map((e, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between">
                    <strong>{e.subject}</strong><span>{e.count}</span>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-center">No enrolments available.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-light">Quick Links</div>
            <div className="card-body d-grid gap-2">
              <a href="modules" className="btn btn-success">Modules</a>
              <a href="instructor-support-list" className="btn btn-success">My Ticket Forums</a>
              {/* <a href="add-lecture-material/:courseId" className="btn btn-success">Add New Lecture Materials</a> */}
              <a href="addannouncement" className="btn btn-success">Add Announcement</a>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Announcements */}
      <div className="card mb-4">
        <div className="card-header bg-light">Latest Announcements</div>
        <ul className="list-group list-group-flush">
          {data.announcements?.length > 0 ? (
            data.announcements.map((ann, i) => (
              <li key={i} className="list-group-item">
                <strong>{ann.title}</strong> <br />
                <span className="text-muted">{new Date(ann.date).toLocaleDateString()}</span>
                <p>{ann.message}</p>
                {ann.fileUrl && (
                  <a href={ann.fileUrl} target="_blank" rel="noreferrer">Download Attachment</a>
                )}
              </li>
            ))
          ) : (
            <li className="list-group-item text-center">No announcements available.</li>
          )}
        </ul>
      </div>

      {/* Lecture Materials */}
      <div className="card mb-4">
        <div className="card-header bg-light">Recent Lecture Materials</div>
        <ul className="list-group list-group-flush">
          {data.lectures?.length > 0 ? (
            data.lectures.map((l, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                <span>{l.title}</span>
                <a href={l.fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm">View</a>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center">No lecture materials available.</li>
          )}
        </ul>
      </div>

      {/* Quizzes */}
      <div className="card mb-4">
        <div className="card-header bg-light">Quizzes</div>
        <ul className="list-group list-group-flush">
          {data.quizzes?.length > 0 ? (
            data.quizzes.map((q, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                <span>{q.title}</span>
                <span>{q.totalMarks} Marks</span>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center">No quizzes available.</li>
          )}
        </ul>
      </div>

      {/* Assignment Submissions */}
      <div className="card mb-4">
        <div className="card-header bg-light">Student Assignment Submissions</div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Student ID</th><th>Subject ID</th><th>Assignment</th>
                <th>Submission Date</th><th>Submitted Date</th><th>Files</th>
              </tr>
            </thead>
            <tbody>
              {data.submissions?.length > 0 ? (
                data.submissions.map((s, i) => (
                  <tr key={i}>
                    <td>{s.studentId || "N/A"}</td>
                    <td>{s.subjectId || "N/A"}</td>
                    <td>{s.assignment || "N/A"}</td>
                    <td>{s.submissionDate || "N/A"}</td>
                    <td>{s.submittedDate || "N/A"}</td>
                    <td>
                      {s.fileUrl ? (
                        <a href={s.fileUrl} className="btn btn-outline-success btn-sm" target="_blank" rel="noreferrer">
                          🔽
                        </a>
                      ) : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center">No submissions available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
