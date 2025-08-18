const express = require('express');
const router = express.Router();

const Announcement = require("../../models/Announcement");
const Assignment = require("../../models/assignmentmodel");
const Lecture = require("../../models/Lecture");
const InstructorSupport = require("../../models/Lecturesupportmodel");
const Module = require("../../models/moduleModel");
const Quiz = require("../../models/Quiz");
const Schedule = require("../../models/Schedule");

// ✅ GET /api/instructor/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const announcements = await Announcement.find({});
    const assignments = await Assignment.find({});
    const lectures = await Lecture.find({});
    const lectureSupport = await InstructorSupport.find({});
    const modules = await Module.find({});
    const quizzes = await Quiz.find({});
    const schedule = await Schedule.find({});


    res.json({
      announcements,
      assignments,
      lectures,
      lectureSupport,
      modules,
      quizzes,
      schedule
    });
  } catch (err) {
    console.error("Dashboard route error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
