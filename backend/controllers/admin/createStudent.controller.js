const User = require("../../models/Student/User");
const Student = require("../../models/Student/student.model");
const Course = require("../../models/courses.model");

exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, age, address, gender, mobile, course } =
      req.body;

    const image = req.file ? req.file.path : null;

    const courseName = await Course.findOne({ title: course });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Step 1: Create User
    const user = new User({
      name,
      email,
      password,
      role: "student",
    });

    await user.save();

    console.log("User created:", user._id);

    // Step 2: Create Student (excluding password if not needed)
    const student = await Student.create({
      userId: user._id,
      name,
      email,
      age,
      address,
      gender,
      mobile,
      course: courseName._id,
      image,
    });

    res.status(201).json({
      message: "Student created successfully",
      userId: user._id,
      studentId: student._id,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: error.message });
  }
};
