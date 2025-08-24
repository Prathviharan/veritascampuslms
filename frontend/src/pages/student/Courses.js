import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../../api/user";

export const Courses = () => {
  const studentId = "68187117c8e50295c68bba3e";
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // NEW STATE
  const [code, setCode] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData) {
          throw new Error("User data is missing");
        }

        setUser(userData);

        const course = userData.course;

        const courseData = await axios.post(
          `http://localhost:5000/api/course`,
          {
            title: course,
          }
        );

        const allCourses = await axios.get(
          `http://localhost:5000/api/courses/${courseData.data._id}/modules`
        );
        const allEnrolled = await axios.get(
          `http://localhost:5000/api/enrolled/${studentId}`
        );
        setCourses(allCourses.data);
        setEnrolledCourses(allEnrolled.data);
      } catch (err) {
        console.error("Error fetching courses");
      }
    };

    fetchAllCourses();
  }, []);

  const handleEnroll = async (moduleId) => {
    setEnrolling(true);
    try {
      await axios.post(`http://localhost:5000/api/enroll/${moduleId}`, {
        studentId,
      });
      alert("Enrolled successfully!");
      const allEnrolled = await axios.get(
        `http://localhost:5000/api/enrolled/${studentId}`
      );
      setEnrolledCourses(allEnrolled.data);
      setSelectedCourse(null); // close modal
    } catch (err) {
      alert("Cannot enroll to the course");
    } finally {
      setEnrolling(false);
    }
  };

  const isEnrolled = (moduleId) => {
    return enrolledCourses.some(
      (enrollment) =>
        enrollment._id === moduleId || enrollment.moduleId === moduleId
    );
  };

  return (
    <div className="container px-3">
      <form className="d-flex px-3" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search Courses"
          aria-label="Search"
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>

      <div className="d-flex flex-column mb-4 ms-4 mt-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              className="d-flex align-items-center justify-content-between mb-2"
              key={course._id}
            >
              <div className="d-flex align-items-center">
                <i className="bi bi-book-half me-3"></i>
                <h6 className="mb-0">{course.title}</h6>
              </div>
              <button
                className="btn btn-success"
                onClick={() => setSelectedCourse(course)}
                disabled={isEnrolled(course._id)}
              >
                {isEnrolled(course._id) ? "Enrolled" : "Enroll"}
              </button>
            </div>
          ))
        ) : (
          <h6>No modules found</h6>
        )}
      </div>

      {/* Modal */}
      {selectedCourse && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content p-4">
              <h5>Enroll in: {selectedCourse.title}</h5>
              <form className="mt-4 d-flex justify-content-center">
                <div className="form-group col-md-8 col-lg-6">
                  <label>Enrollment Code</label>
                  <input
                    type="text"
                    className="form-control mt-3 mb-3"
                    placeholder="Enter your enrollment code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
              </form>
              <div className="d-flex gap-3 mt-3 justify-content-center">
                <button
                  className="btn btn-success"
                  onClick={() => handleEnroll(selectedCourse._id)}
                  disabled={enrolling}
                >
                  {enrolling ? "Enrolling..." : "Confirm Enroll"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedCourse(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
