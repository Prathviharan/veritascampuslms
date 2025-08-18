const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true, // Ensure studentId is provided
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true, // Ensure courseId is provided
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ studentId: 1, moduleId: 1 }, { unique: true }); // Prevent duplicate enrollments

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
