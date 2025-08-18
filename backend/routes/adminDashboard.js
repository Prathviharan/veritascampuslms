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

// Existing dashboard route
router.get("/dash", async (req, res) => {
  try {
    // Fetch general overview counts
    const [
      totalCourses,
      totalInstructors,
      totalStudents,
      totalExams,
      totalQuizzes,
      totalCertificates,
    ] = await Promise.all([
      Course.countDocuments(),
      Instructor.countDocuments(),
      Student.countDocuments(),
      Exam.countDocuments(),
      Quiz.countDocuments(),
      Enrollment.countDocuments({ certificateIssued: true }), // Ensure this field exists and is boolean
    ]);

    // Fetch all courses
    const courses = await Course.find({}, "_id title");

    // Count students per course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Enrollment.countDocuments({
          courseId: course._id,
        });
        return {
          _id: course._id,
          title: course.title,
          userCount: studentCount,
        };
      })
    );

    // Filter out courses with 0 students and sort by descending student count
    const popular = coursesWithCounts
      .filter((course) => course.userCount > 0)
      .sort((a, b) => b.userCount - a.userCount);

    // Return dashboard data
    res.json({
      overview: {
        totalCourses,
        totalInstructors,
        totalStudents,
        totalExams,
        totalQuizzes,
        totalCertificates,
      },
      popularCourses: popular.map((course) => ({
        title: course.title,
        users: course.userCount,
      })),
      recentActivities: [], // You can populate this in the future
    });
  } catch (error) {
    console.error("Dashboard route error:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// New route for course progress
router.get("/progress", async (req, res) => {
  try {
    // Total counts
    const [
      totalAssignments,
      totalQuizzes,
      totalLectures,
      totalMaterials,
      totalExams,
    ] = await Promise.all([
      Assignment.countDocuments(),
      Quiz.countDocuments(),
      Lecture.countDocuments(),
      Material.countDocuments(),
      Exam.countDocuments(),
    ]);

    // Completed counts (using submissions and published/active status)
    const [completedAssignments, completedQuizzes] = await Promise.all([
      AssignmentSubmission.countDocuments(), // submitted assignments
      QuizeSubmition.countDocuments(), // submitted quizzes
    ]);

    // For lectures/materials/exams, count only published/active ones for simplicity
    const [completedLectures, completedMaterials, completedExams] =
      await Promise.all([
        Lecture.countDocuments({ isPublished: true }), // assuming this flag exists
        Material.countDocuments({ isPublished: true }),
        Exam.countDocuments({ isActive: true }),
      ]);

    // Total items to complete
    const totalItems =
      totalAssignments +
      totalQuizzes +
      totalLectures +
      totalMaterials +
      totalExams;
    // Completed items
    const completedItems =
      completedAssignments +
      completedQuizzes +
      completedLectures +
      completedMaterials +
      completedExams;

    // Avoid division by zero
    if (totalItems === 0) {
      return res.json({ completed: 0, incomplete: 0 });
    }

    // Calculate percentages
    const completedPercent = Math.round((completedItems / totalItems) * 100);
    const incompletePercent = 100 - completedPercent;

    res.json({
      completed: completedPercent,
      incomplete: incompletePercent,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({ message: "Error fetching course progress data" });
  }
});

module.exports = router;
