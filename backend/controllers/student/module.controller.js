const Course = require('../../models/courses.model');
const UserProgress = require('../../models/userProgress.model');
const Lecture = require('../../models/Lecture');
const LectureMaterial = require('../../models/LectureMaterial'); 
const Tutorial = require('../../models/Tutorial'); 
const Quiz = require('../../models/Quiz');
const Assignment = require('../../models/assignmentmodel');
const { calculateProgress } = require('./progress.controller'); 

const getModuleContent = async (req, res) => {
  try {
    const { courseId, moduleId, studentId } = req.params;
    const mongoose = require('mongoose');
    const moduleObjectId = new mongoose.Types.ObjectId(moduleId); 

    
    const course = await Course.findById(courseId)
      .populate({
        path: 'modules',
        match: { _id: moduleObjectId }, 
        populate: [
          { path: 'lecturematerials', model: 'LectureMaterial' },
          { path: 'tutorials', model: 'Tutorial' },
          { path: 'quizzes', model: 'Quiz' },
          { path: 'assignments', model: 'Assignment' }
        ]
      });
    

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = course.modules[0];
    if (!module) {
      return res.status(404).json({ message: 'Module not found in this course' });
    }

    // Get student's progress for this specific course
    const userProgress = await UserProgress.findOne({ courseId, studentId });

    // Combine all module items and their completion status
    const allModuleItems = [];

    // Add lecture materials
    if (Array.isArray(module.lecturematerials)) {
      module.lecturematerials.forEach(lecture => {
        allModuleItems.push({
          _id: lecture._id,
          title: lecture.title,
          type: 'lecture',
          fileUrl: lecture.fileUrl || null, 
          completed: userProgress
            ? userProgress.completedLectures?.map(String).includes(String(lecture._id))
            : false,
          icon: 'bi bi-filetype-pdf' 
        });
      });
    }

    // Add tutorials
    if (Array.isArray(module.tutorials)) {
      module.tutorials.forEach(tutorial => {
        allModuleItems.push({
          _id: tutorial._id,
          title: tutorial.title,
          type: 'tutorial',
          fileUrl: tutorial.fileUrl, 
          completed: userProgress ? userProgress.completedTutorials?.map(String).includes(String(tutorial._id)) : false,
          icon: 'bi bi-filetype-pdf'
        });
      });
    }

    // Add quizzes
    if (Array.isArray(module.quizzes)) {
      module.quizzes.forEach(quiz => {
        allModuleItems.push({
          _id: quiz._id,
          title: quiz.title,
          type: 'quiz',
          completed: userProgress ? userProgress.attemptedQuizzes?.map(String).includes(String(quiz._id)) : false,
          icon: 'bi bi-question-square'
        });
      });
    }

    // Add assignments
    if (Array.isArray(module.assignments)) {
      module.assignments.forEach(assignment => {
        allModuleItems.push({
          _id: assignment._id,
          title: assignment.title,
          type: 'assignment',
          fileUrl: assignment.fileUrl, 
          completed: userProgress ? userProgress.completedAssignments?.map(String).includes(String(assignment._id)) : false,
          icon: 'bi bi-journal-arrow-up'
        });
      });
    }

    // Add recordings
    (module.recordings || []).forEach((recordingUrl, index) => {
      allModuleItems.push({
        _id: `recording-${module._id}-${index}`,
        title: `Recording ${index + 1}`,
        type: 'recording',
        fileUrl: recordingUrl,
        completed: false,
        icon: 'bi bi-file-earmark-play'
      });
    });


    // Calculate overall course progress using the exported function
    const overallProgressPercentage = await calculateProgress(courseId, studentId);

    return res.status(200).json({
      courseTitle: course.title,
      moduleTitle: module.title,
      moduleItems: allModuleItems, 
      overallProgressPercentage: overallProgressPercentage,
    });

  } catch (err) {
    console.error("Error fetching module content:", err.message, err.stack);
    return res.status(500).json({ message: "Error fetching module content!", error: err.message });
  }
};

module.exports = {
  getModuleContent,
};