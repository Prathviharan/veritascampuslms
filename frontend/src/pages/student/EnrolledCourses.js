import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../../api/user";

const EnrolledCourses = () => {
  const [courses, setCourse] = useState([]);
  const [user, setUser] = useState(null);
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData) {
          throw new Error("User data is missing");
        }

        setUser(userData);

        const courses = await axios.get(
          `http://localhost:5000/api/enrolled/${studentId}`
        );
        setCourse(courses.data);
      } catch (err) {
        console.error("error fetching enrolledcourses");
      }
    };
    fetchCourses();
  }, [user]);

  return (
    <div className="container px-3">
      <h3 className="mb-4 mt-4">Enrolled Courses</h3>
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
  );
};

export default EnrolledCourses;
