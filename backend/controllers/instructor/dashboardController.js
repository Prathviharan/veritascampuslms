const express = require('express');
const router = express.Router();
const Lecture = require('../../models/Lecture');
const LectureTicket = require('../../models/Lecturesupportmodel');
const Assignment = require('../../models/assignmentmodel');
const Quiz = require('../../models/Quiz');
const Schedule = require('../../models/Schedule');
const Announcement = require('../../models/announcementModel');
const Module = require('../../models/Module'); // Assuming Module model exists

// Controller for instructor dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const instructorId = req.user?.id || "6817764dd41f3af66d093238"; // Replace with real auth logic

    const tickets = await LectureTicket.find({ userId: instructorId });
    const lecture = await Lecture.find().limit(5);
    const schedule = await Schedule.findOne({ instructor: instructorId });
    const assignments = await Assignment.find({ instructorId });
    const announcements = await Announcement.find({ visibility: 'Public' }).sort({ date: -1 }).limit(5);
    const modules = await Module.find({ instructorId });

    const enrolments = [
      { subject: 'Database Systems', count: 35 },
      { subject: 'Image Understanding and Processing', count: 40 }
    ];

    const submissions = assignments.map((a, i) => ({
      studentId: a.studentId || `STD${1000 + i}`,
      subjectId: a.subjectId || `IT-${200 + i}`,
      assignment: a.title,
      submissionDate: a.submissionDate || new Date().toLocaleDateString(),
      submittedDate: a.submittedDate || new Date().toLocaleString(),
      fileUrl: a.fileUrl || '#'
    }));

    res.json({
      tickets,
      lecture,
      schedule,
      enrolments,
      submissions,
      announcements,
      modules
    });

  } catch (err) {
    res.status(500).json({ message: 'Dashboard data fetch failed', error: err.message });
  }
});

module.exports = router;
