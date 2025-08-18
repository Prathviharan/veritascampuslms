const express = require("express");
const router = express.Router();
const StudentSupport = require("../models/Student/supportModel");
const InstructorSupport = require("../models/Lecturesupportmodel");
const mongoose = require("mongoose");

// Get all student support requests
router.get("/students", async (req, res) => {
  try {
    const requests = await StudentSupport.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student requests" });
  }
});

// Get all instructor support requests
router.get("/instructors", async (req, res) => {
  try {
    const requests = await InstructorSupport.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching instructor requests" });
  }
});

// Update request status
router.put("/updateStatus/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    let updatedRequest = await StudentSupport.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      updatedRequest = await InstructorSupport.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    }

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(updatedRequest);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Error updating status", error: err });
  }
});

// Get support request by ID (either student or instructor)
router.get("/getRequestById/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let request = await StudentSupport.findById(id);
    if (!request) {
      request = await InstructorSupport.findById(id);
    }

    if (!request) {
      return res.status(404).json({ message: "Support request not found" });
    }

    res.json(request);
  } catch (err) {
    console.error("Error fetching request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reply
router.put("/reply/:id", async (req, res) => {
  const { id } = req.params;
  const { message, adminName } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const updateData = {
    status: "replied",
    adminReply: {
      message,
      adminName,
      repliedAt: new Date()
    }
  };

  try {
    let updatedRequest = await StudentSupport.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedRequest) {
      updatedRequest = await InstructorSupport.findByIdAndUpdate(id, updateData, { new: true });
    }

    if (!updatedRequest) {
      return res.status(404).json({ message: "Support request not found" });
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating reply:", error);
    res.status(500).json({ message: "Failed to send reply", error: error.message });
  }
});


module.exports = router;
