import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profileimage from "../../assets/profileimage.png";
import axios from "axios";
import { getCurrentUser } from "../../api/user";

const StudentProfile = () => {
  const [courses, setCourse] = useState([]);
  const [student, setStudent] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const studentId = localStorage.getItem("studentId");

  // Handle Profile Edit
  const handleEditProfile = () => {
    navigate("/student/editprofile");
  };

  // Handle Password Change
  const handleChangePassword = () => {
    navigate("/student/changepassword");
  };

  // Fetch User and Student Data
  useEffect(() => {
    const fetchUserAndStudent = async () => {
      try {
        setLoading(true);

        // Fetch Current User
        const userData = await getCurrentUser();
        if (!userData) {
          throw new Error("User data is missing");
        }

        setUser(userData);

        // Fetch Student Profile using userId (_id)
        const studentRes = await axios.get(
          `http://localhost:5000/api/student/profile/${userData._id}`
        );
        const studentData = studentRes.data.studentProfile;
        setStudent(studentData);
        const response = await axios.get(
          `http://localhost:5000/api/enrolled/${studentId}`
        );
        setCourse(response.data);

        // Handle image preview
        if (studentData?.image) {
          setPreviewImage(`http://localhost:5000/${studentData.image}`);
        }
      } catch (err) {
        console.error("Error fetching user or student data", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStudent();
  }, []);

  // Handle logout
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  if (loading) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div>Student data not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="container d-flex justify-content-center">
        <h2
          className="fw-bold fs-2 fs-md-3 fs-sm-4 "
          style={{ color: "#55B649" }}
        >
          Student Profile
        </h2>
      </div>
      <div className="container mt-5">
        <div className="row mt-4">
          <div className="col-12 col-md-6 text-center">
            <img
              src={previewImage || profileimage}
              alt="Student Profile"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #ccc",
              }}
            />
          </div>
          <div className="col-12 col-md-6 mt-4">
            <h6 className="mt-3">Name: {student?.name}</h6>

            <h6 className="mt-3">Email: {student?.email}</h6>
            <h6 className="mt-3">Diploma: {student?.course}</h6>
          </div>
        </div>
      </div>

      <Link
        to="/student/enrolledcourses"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="container border border-dark mt-5 px-3">
          <h3 className="mb-4 mt-4">Enrolled Modules</h3>
          <div className="d-flex flex-column mb-4 ms-4">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div className="d-flex align-items-center" key={index}>
                  <i className="bi bi-book-half me-3"></i>
                  <h6>{course.title}</h6>
                </div>
              ))
            ) : (
              <h6>No enrolled modules</h6>
            )}
          </div>
        </div>
      </Link>

      <Link to="/progress" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="container border border-dark mt-5 px-3">
          <h3 className="mb-4 mt-4">Graded Summery</h3>
          <div className="d-flex flex-column mb-4 ms-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-bookmark-check-fill me-3"></i>
              <h6>Semester GPA: </h6>
            </div>
            <div className="d-flex align-item-center">
              <i className="bi bi-bookmark-check-fill me-3"></i>
              <h6>Total Credits Earned: </h6>
            </div>
            <div className="d-flex align-item-center">
              <i className="bi bi-bookmark-check-fill me-3"></i>
              <h6>Completed Courses Count: </h6>
            </div>
          </div>
        </div>
      </Link>

      <div className="container border border-dark mt-5 px-3">
        <h3 className="mb-4 mt-4">Login Activity</h3>
        <div className="d-flex flex-column mb-4 ms-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-calendar3 me-3"></i>
            <h6>
              First access to site:{" "}
              {student?.createdAt
                ? new Date(student.createdAt).toLocaleDateString()
                : "N/A"}
            </h6>
          </div>
          <div className="d-flex align-items-center">
            <i className="bi bi-calendar3 me-3"></i>
            <h6>
              Last access to site:{" "}
              {student?.updatedAt
                ? new Date(student.updatedAt).toLocaleDateString()
                : "N/A"}
            </h6>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <button
          className="btn btn-success fw-bold mt-5"
          style={{
            width: "300px",
            height: "30px",
            fontSize: "15px",
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: "#95C436",
            color: "white",
            border: "1px solid #3E9355",
            borderRadius: "6px",
          }}
          onClick={handleEditProfile}
        >
          Edit Profile
        </button>
      </div>

      <div className="d-flex justify-content-center">
        <button
          className="btn btn-success fw-bold mt-2"
          style={{
            width: "300px",
            height: "30px",
            fontSize: "15px",
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: "#95C436",
            color: "white",
            border: "1px solid #3E9355",
            borderRadius: "6px",
          }}
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      </div>

      <div className="d-flex justify-content-center">
        <button
          className="btn btn-secondary fw-bold mt-2"
          style={{
            width: "300px",
            height: "30px",
            fontSize: "15px",
            fontFamily: "'Poppins', sans-serif",
            color: "white",
            border: "1px solid #3E9355",
            borderRadius: "6px",
          }}
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </div>

      {showLogoutModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title text-danger fw-bold">
                  Confirm Logout
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogoutModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-center">
                <p className="fs-5 text-muted">
                  Are you sure you want to log out?
                </p>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger px-4" onClick={confirmLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
