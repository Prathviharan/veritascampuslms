const User = require("../../models/Student/User");
const Student = require("../../models/Student/student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.signUp = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      email,
      name,
      password,
      role,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last sign in
    user.lastSignIn = new Date();
    await user.save();

    let studentId = null;
    if (user.role === "student") {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        studentId = student._id;
      }
    }

    // Generate token
    const token = generateToken({
      id: user._id,
      role: user.role,
      ...(studentId && { studentId }),
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
