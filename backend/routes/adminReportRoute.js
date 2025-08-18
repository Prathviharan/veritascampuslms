const express = require("express");
const router = express.Router();
const Enrollment = require("../models/enrollment.model");
const Student = require("../models/Student/student.model");
const Instructor = require("../models/Instructors");
const PasswordChange = require("../models/UserChanges");
const Course = require("../models/courses.model");
const Assignment = require("../models/assignmentmodel");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Exam = require("../models/Exam");
const InstructorSupport = require("../models/Lecturesupportmodel");
const Material = require("../models/Material");
const Quiz = require("../models/Quiz");
const StudentSupport = require("../models/Student/supportModel");
const Lecture = require("../models/Lecture");
const QuizeSubmition = require("../models/Student/QuizAnswer.model");

// Login and registration activity logs
router.get("/logins", async (req, res) => {
  try {
    const [enrollments, student, instructor, passwordChanges, courses] =
      await Promise.all([
        Enrollment.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              enrollments: { $sum: 1 },
            },
          },
        ]),
        Student.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              student: { $sum: 1 },
            },
          },
        ]),
        Instructor.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              instructor: { $sum: 1 },
            },
          },
        ]),
        PasswordChange.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              passwordChanges: { $sum: 1 },
            },
          },
        ]),
        Course.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              courses: { $sum: 1 },
            },
          },
        ]),
      ]);

    const map = {};

    // Merge data from all collections into a single map keyed by date
    [
      ...enrollments,
      ...student,
      ...instructor,
      ...passwordChanges,
      ...courses,
    ].forEach((item) => {
      const date = item._id;
      if (!map[date]) {
        map[date] = {
          date,
          enrollments: 0,
          student: 0,
          instructor: 0,
          passwordChanges: 0,
          courses: 0,
        };
      }
      if (item.enrollments !== undefined)
        map[date].enrollments = item.enrollments;
      if (item.student !== undefined) map[date].student = item.student;
      if (item.instructor !== undefined) map[date].instructor = item.instructor;
      if (item.passwordChanges !== undefined)
        map[date].passwordChanges = item.passwordChanges;
      if (item.courses !== undefined) map[date].courses = item.courses;
    });

    const merged = Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    console.log("Backend Merged Login Data:", merged); // Debugging: Log data sent to frontend
    res.json(merged);
  } catch (error) {
    console.error("Error in /logins route:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Course revision history - this fetches all courses, not just revisions.
// Consider adding a field to your schema to track actual revisions or last updated time more granularly if needed.
router.get("/courseRevisions", async (req, res) => {
  try {
    const courses = await Course.find(); // This will fetch all courses, regardless of if they were "revised"
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course data", error: err });
  }
});

// Generic GET endpoints for various models
const routeMap = [
  { path: "/assignment", model: Assignment },
  { path: "/assignmentSubmission", model: AssignmentSubmission },
  { path: "/changes", model: PasswordChange },
  { path: "/entroll", model: Enrollment },
  { path: "/instructor", model: Instructor }, // This fetches all instructors, not just logins
  { path: "/student", model: Student }, // This fetches all students, not just logins
  { path: "/exam", model: Exam },
  { path: "/instrucorSup", model: InstructorSupport },
  { path: "/lectureM", model: Material },
  { path: "/quize", model: Quiz },
  { path: "/studentSup", model: StudentSupport },
  { path: "/lecture", model: Lecture },
  { path: "/quizeSubmition", model: QuizeSubmition },
];

routeMap.forEach(({ path, model }) => {
  router.get(path, async (req, res) => {
    try {
      const data = await model.find();
      console.log(`Backend ${model.modelName} Data:`, data); // Debugging: Log data for each endpoint
      res.json(data);
    } catch (err) {
      console.error(`Error fetching data for ${model.modelName}:`, err); // More specific error logging
      res.status(500).json({ error: "Server error" });
    }
  });
});

module.exports = router;
