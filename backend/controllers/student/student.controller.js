const Student = require("../../models/Student/student.model");
const User = require("../../models/Student/User"); // Ensure correct import
const bcrypt = require("bcrypt");

const addStudent = async (req, res) => {
  try {
    const { name, age, email, address, gender, mobile, course, password } =
      req.body;

    const newStudent = new Student({
      name,
      age,
      email,
      address,
      gender,
      mobile,
      course,
      password,
      image: req.file.path,
    });

    await newStudent.save();
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    if (!studentId) {
      return res.sendStatus(401);
    }

    const student = await Student.findOne({ _id: studentId });

    if (!student) {
      return res.sendStatus(401);
    }

    return res.json({ student });
  } catch (err) {
    return res.sendStatus(500);
  }
};

const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const image = req.file ? req.file.path : null;

    const updatedFields = {};
    if (email) {
      updatedFields.email = email;
    }
    if (image) {
      updatedFields.image = image;
    }

    if (!id) {
      return res.sendStatus(401);
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    return res.json({ Student: updatedStudent });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const changepassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { newPassword, currentPassword, confirmPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password!" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Confirm password does not match!" });
    }

    user.password = newPassword; // This will be hashed by the pre-save hook
    await user.save();

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addStudent,
  editStudent,
  getStudent,
  changepassword,
};
