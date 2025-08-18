const Course = require("../../models/courses.model");
const Module = require("../../models/moduleModel");
const UserProgress = require("../../models/userProgress.model");

const calculateProgress = async (moduleId, studentId) => {
  const module = await Module.findById(moduleId);
  const progress = await UserProgress.findOne({ moduleId, studentId });

  if (!module) {
    throw new Error("Module not found");
  }

  // Handle cases where progress document might not exist yet for a new student/course
  const completedLectures = progress ? progress.completedLectures.length : 0;
  const completedTutorials = progress ? progress.completedTutorials.length : 0;
  //const attemptedQuizes = progress ? progress.attemptedQuizes.length : 0;
  const completedAssignments = progress
    ? progress.completedAssignments.length
    : 0;

  // FIXED: Added null/undefined checks for course.lectures, etc.
  const totalLectures = module.lectures ? module.lectures.length : 0;
  const totalTutorials = module.tutorials ? module.tutorials.length : 0;
  //const totalQuizes = module.quizes ? module.quizes.length : 0;
  const totalAssignments = module.assignments ? module.assignments.length : 0;

  const totalItems = totalLectures + totalTutorials + totalAssignments;

  const completedItems = completedLectures + completedTutorials;

  const percentage =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return percentage;
};

const getProgress = async (req, res) => {
  try {
    const { moduleId, studentId } = req.params;

    const percentage = await calculateProgress(moduleId, studentId);
    const progressDetail = await UserProgress.findOne({ moduleId, studentId }); // FIXED: Fetch the full document

    return res.status(200).json({ percentage, progressDetail }); // FIXED: Return both
  } catch (err) {
    console.error("Error getting progress:", err);
    return res
      .status(500)
      .json({ message: "Error getting progress!", error: err.message });
  }
};

const markLectureComplete = async (req, res) => {
  try {
    const { moduleId, studentId, lectureId } = req.body;

    const progress = await UserProgress.findOneAndUpdate(
      { moduleId, studentId },
      { $addToSet: { completedLectures: lectureId } },
      { new: true, upsert: true }
    );

    return res.status(200).json({ progress });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error marking lecture as complete" });
  }
};

const markTutorialComplete = async (req, res) => {
  try {
    const { moduleId, studentId, tutorialId } = req.body;

    const progress = await UserProgress.findOneAndUpdate(
      { moduleId, studentId },
      { $addToSet: { completedTutorials: tutorialId } },
      { new: true, upsert: true }
    );

    return res.status(200).json({ progress });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error marking tutorial progress", error: err.message });
  }
};

const markQuizAttempt = async (req, res) => {
  try {
    const { moduleId, studentId, quizId } = req.body;

    const progress = await UserProgress.findOneAndUpdate(
      { moduleId, studentId },
      { $addToSet: { attemptedQuizes: quizId } },
      { new: true, upsert: true }
    );

    return res.status(200).json({ progress });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating quiz progress", error: err.message });
  }
};

const markAssignmentComplete = async (req, res) => {
  try {
    const { moduleId, studentId, assignmentId } = req.body;

    const progress = await UserProgress.findOneAndUpdate(
      { moduleId, studentId },
      { $addToSet: { completedAssignments: assignmentId } },
      { new: true, upsert: true }
    );

    return res.status(200).json({ progress });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating assignment progress",
      error: err.message,
    });
  }
};

module.exports = {
  getProgress,
  markLectureComplete,
  markTutorialComplete, // FIXED: Export the corrected name
  markQuizAttempt,
  markAssignmentComplete,
  calculateProgress,
};
