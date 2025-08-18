// Updated assignmentController.js
const Assignment = require('../../models/assignmentmodel');
const path = require('path');
const fs = require('fs');

// Upload New Assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, visibility, deadline } = req.body;

    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(__dirname, '../../uploads', fileName);

    file.mv(filePath, async (err) => {
      if (err) return res.status(500).json({ error: 'File upload failed' });

      // Create date object from the ISO string
      const deadlineDate = new Date(deadline);
      
      // Extract the components
      const year = deadlineDate.getFullYear();
      const month = deadlineDate.getMonth();
      const day = deadlineDate.getDate();
      const hours = deadlineDate.getHours();
      const minutes = deadlineDate.getMinutes();

      // Create a new date with the exact components
      const exactDate = new Date(year, month, day, hours, minutes);

      const newAssignment = new Assignment({
        title,
        description,
        fileUrl: fileName,
        visibility,
        deadline: exactDate
      });

      await newAssignment.save();
      res.status(201).json({ message: 'Assignment uploaded successfully', assignment: newAssignment });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete Assignment by ID
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const filePath = path.join(__dirname, '../../uploads', assignment.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Assignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get Single Assignment
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update Assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, visibility, deadline } = req.body;
    
    // Create date object from the ISO string
    const deadlineDate = new Date(deadline);
    
    // Extract the components
    const year = deadlineDate.getFullYear();
    const month = deadlineDate.getMonth();
    const day = deadlineDate.getDate();
    const hours = deadlineDate.getHours();
    const minutes = deadlineDate.getMinutes();

    // Create a new date with the exact components
    const exactDate = new Date(year, month, day, hours, minutes);

    let updatedFields = { 
      title, 
      description, 
      visibility, 
      deadline: exactDate
    };

    if (req.files && req.files.file) {
      const assignment = await Assignment.findById(req.params.id);
      if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

      // Delete old file
      const oldPath = path.join(__dirname, '../../uploads', assignment.fileUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      // Save new file
      const file = req.files.file;
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(__dirname, '../../uploads', fileName);
      await file.mv(filePath);
      updatedFields.fileUrl = fileName;
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.status(200).json({ message: 'Assignment updated successfully', assignment: updatedAssignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
