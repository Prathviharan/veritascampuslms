// routes/adminCourseStats.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/courses.model');
const Enrollment = require('../models/enrollment.model');
const LectureMaterial = require('../models/Material');
const Exam = require('../models/Exam');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/assignmentmodel'); // fix model name

// GET all courses with stats
router.get('/stats', async (req, res) => {
  try {
    const courses = await Course.find();

    const details = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Enrollment.countDocuments({ courseID: course._id });
        const moduleCount = course.modules?.length || 0;

        return {
          _id: course._id,
          title: course.title,
          description: course.description,
          instructor: course.instructor || [],
          instructorCount: course.instructor.length,
          numStudents: studentCount,
          numModules: moduleCount,
        };
      })
    );

    res.json(details);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET course details by id
router.get('/details/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const materials = await LectureMaterial.find({ courseId });
    const assignments = await Assignment.find({ courseId });
    const quizzes = await Quiz.find({ courseId });
    const exams = await Exam.find({ courseId });

    res.json({ course, materials, assignments, quizzes, exams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
});

// POST add new course
router.post('/stats', async (req, res) => {
  try {
    const { title, description, instructor } = req.body;

    if (!title || !instructor || !Array.isArray(instructor) || instructor.some(i => !i.trim())) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const newCourse = new Course({
      title: title.trim(),
      description: description ? description.trim() : '',
      instructor: instructor.map(i => i.trim()),
    });

    const saved = await newCourse.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add course' });
  }
});

// PUT update course
router.put('/stats/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid course ID' });
  }

  const { title, description, instructor } = req.body;

  if (!title || !instructor || !Array.isArray(instructor) || instructor.some(i => !i.trim())) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const updated = await Course.findByIdAndUpdate(id, {
      title: title.trim(),
      description: description ? description.trim() : '',
      instructor: instructor.map(i => i.trim()),
    }, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: 'Course not found' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE course
router.delete('/stats/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid course ID' });
  }

  try {
    await Course.findByIdAndDelete(id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;
