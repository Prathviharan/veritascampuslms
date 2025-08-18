const Instructor = require("../../models/Instructor");
const User = require("../../models/Student/User");

// Create Instructor
const createInstructor = async (req, res) => {
  try {
    const { name, email, department, contactNumber, assignedCourse, password } =
      req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !department ||
      !contactNumber ||
      !assignedCourse ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
        required: [
          "name",
          "email",
          "department",
          "contactNumber",
          "assignedCourse",
          "password",
        ],
      });
    }

    // Check if email already exists
    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      role: "instructor",
    });

    await user.save();

    // Validate contact number format
    if (!/^\d{10}$/.test(contactNumber)) {
      return res
        .status(400)
        .json({ message: "Contact number must be exactly 10 digits" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const newInstructor = new Instructor({
      userId: user._id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      contactNumber,
      assignedCourse: assignedCourse.trim(),
      password,
    });

    const savedInstructor = await newInstructor.save();
    res.status(201).json({
      message: "Instructor created successfully",
      instructor: savedInstructor,
    });
  } catch (error) {
    console.error("Error creating instructor:", error.message);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all instructors
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Instructors fetched successfully",
      count: instructors.length,
      instructors,
    });
  } catch (error) {
    console.error("Error fetching instructors:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get instructor by ID
const getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;

    const instructor = await Instructor.findById(id).select("-password");
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.status(200).json({
      message: "Instructor fetched successfully",
      instructor,
    });
  } catch (error) {
    console.error("Error fetching instructor:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid instructor ID format" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Instructor
const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, contactNumber, assignedCourse, password } =
      req.body;

    const instructor = await Instructor.findById(id);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Check if email is being updated and if it already exists
    if (email && email !== instructor.email) {
      const emailExists = await Instructor.findOne({
        email: email.toLowerCase(),
      });
      if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    // Validate contact number if provided
    if (contactNumber && !/^\d{10}$/.test(contactNumber)) {
      return res
        .status(400)
        .json({ message: "Contact number must be exactly 10 digits" });
    }

    // Validate password length if provided
    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Update fields
    if (name) instructor.name = name.trim();
    if (email) instructor.email = email.trim().toLowerCase();
    if (department) instructor.department = department.trim();
    if (contactNumber) instructor.contactNumber = contactNumber;
    if (assignedCourse) instructor.assignedCourse = assignedCourse.trim();
    if (password) instructor.password = password;

    const updatedInstructor = await instructor.save();
    res.status(200).json({
      message: "Instructor updated successfully",
      instructor: updatedInstructor,
    });
  } catch (error) {
    console.error("Error updating instructor:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid instructor ID format" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Instructor
const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;

    const instructor = await Instructor.findByIdAndDelete(id);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.status(200).json({
      message: "Instructor deleted successfully",
      instructor: {
        instructorID: instructor.instructorID,
        name: instructor.name,
        email: instructor.email,
      },
    });
  } catch (error) {
    console.error("Error deleting instructor:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid instructor ID format" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
};
