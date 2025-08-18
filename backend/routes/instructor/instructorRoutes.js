const express = require("express");
console.log("instructorRoutes.js is being loaded");
const router = express.Router();

const {
  getModuleDetails,
  addContentToModule,
  updateContentInModule,
  deleteContentFromModule,
  createModule,
  getAllModules,
  getAllAssignments,
  createAssignmentForModule,
  updateAssignmentInModule,
} = require("../../controllers/instructor/instructorController");

// GET all modules for instructor
router.get("/", getAllModules); // Corrected

// GET module details for instructor
router.get("/:moduleId", getModuleDetails); // Corrected

// POST create a new module
router.post("/addModule", createModule); // Corrected

// POST add content to a module
router.post("/:moduleId/content", addContentToModule); // Corrected

// PUT update content in a module
router.put("/:moduleId/content/:contentId", updateContentInModule); // Corrected

// DELETE content from a module
router.delete("/:moduleId/content/:contentId", deleteContentFromModule); // Corrected

// GET all assignments for instructor
router.get("/assignments/all", getAllAssignments); // Changed path to avoid conflict with ":moduleId"

// POST add a new assignment to a module
router.post("/:moduleId/assignments", createAssignmentForModule); // Corrected

// PUT update an assignment within a module
router.put("/:moduleId/assignments/:assignmentId", updateAssignmentInModule); // Corrected

module.exports = router;
