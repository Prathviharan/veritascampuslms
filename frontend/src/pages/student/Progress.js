import axios from "axios";
import React, { useEffect, useState } from "react";

const Progress = () => {
  const moduleId = "6825fa37c2faef1f37a2a4ec";
  const studentId = "68187117c8e50295c68bba3e";
  const [course, setCourse] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/course/${moduleId}`
        );
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course", err);
      }
    };

    fetchCourse();
  }, [moduleId]);

  useEffect(() => {
    const getProgress = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/progress/${studentId}/${moduleId}`
        );
        setProgress(res.data || 25);
      } catch (err) {
        console.error("Error fetching progress", err);
        setProgress(25);
      }
    };
    getProgress();
  }, [moduleId]);

  return (
    <div>
      <div className="container d-flex justify-content-center">
        <h2 className="fw-bold fs-2" style={{ color: "#55B649" }}>
          Progress
        </h2>
      </div>

      <div className="container d-flex justify-content-center mt-5">
        <div
          className="card p-4 shadow-sm"
          style={{ width: "100%", maxWidth: "500px" }}
        >
          <h5 className="mb-3 text-center">
            {course.title || "Loading course..."}
          </h5>

          <div className="mb-2">Progress</div>
          <div
            className="progress"
            role="progressbar"
            aria-label={`${course.title} progress`}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="progress-bar"
              style={{ width: `${progress}%`, backgroundColor: "#55B649" }}
            ></div>
          </div>

          <div className="text-end mt-1">{progress}% complete</div>
          <div className="mt-4">
            <p>Lectures completed: </p>
            <p>Tutorials completed: </p>
            {/* <p>Quizes attempted: </p> */}
            <p>Assignments submitted: </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
