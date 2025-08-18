const Module = require("../../models/moduleModel");
// const Assignment = require("../../models/assignmentModel"); // Assuming an Assignment model exists
const mongoose = require("mongoose");
const Course = require("../../models/courses.model");

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get module details for instructor
const getModuleDetails = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.moduleId)) {
      return res.status(400).json({ message: "Invalid module ID format" });
    }
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add content to a module
const addContentToModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    module.content.push(req.body);
    await module.save();
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update content in a module
const updateContentInModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    const content = module.content.id(req.params.contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    Object.assign(content, req.body);
    await module.save();
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete content from a module
const deleteContentFromModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    module.content.pull(req.params.contentId);
    await module.save();
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new module
// Adjust the path as needed

const createModule = async (req, res) => {
  try {
    const { course, title, description, week, code } = req.body;

    // Validate required fields
    if (!course || !title || week === undefined || !code) {
      return res
        .status(400)
        .json({ message: "courseId, title, and week are required." });
    }

    const courseName = await Course.findOne({ title: course });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create the Module
    const newModule = new Module({
      course: courseName._id,
      title,
      description,
      week,
      code,
      lecturematerials: [],
      tutorials: [],
      quizzes: [],
      assignments: [],
      recordings: [],
    });

    const savedModule = await newModule.save();

    // Add module to the Course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseName._id,
      { $push: { modules: savedModule._id } },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(201).json({
      message: "Module created and added to course successfully",
      module: savedModule,
    });
  } catch (error) {
    console.error("Error creating module:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET all modules for instructor
const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find(); // Fetch all modules
    res.status(200).json(modules); // Respond with the array of modules and 200 status
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with error
  }
};

// GET all assignments for instructor
const getAllAssignments = async (req, res) => {
  try {
    // Assuming you have an Assignment model
    const assignments = await Assignment.find(); // Fetch all assignments
    res.status(200).json(assignments); // Respond with the array of assignments and 200 status
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with error
  }
};

// POST create a new assignment for a module
const createAssignmentForModule = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.moduleId)) {
      return res.status(400).json({ message: "Invalid module ID format" });
    }
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    const { title, description, dueDate } = req.body;
    const newAssignment = new Assignment({ title, description, dueDate });
    module.assignments.push(newAssignment);
    await module.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update assignment in a module
const updateAssignmentInModule = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.moduleId)) {
      return res.status(400).json({ message: "Invalid module ID format" });
    }
    if (!isValidObjectId(req.params.assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID format" });
    }
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    const assignment = module.assignments.id(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    Object.assign(assignment, req.body);
    await module.save();
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getModuleDetails,
  addContentToModule,
  updateContentInModule,
  deleteContentFromModule,
  createModule,
  getAllModules,
  getAllAssignments,
  createAssignmentForModule,
  updateAssignmentInModule,
};
