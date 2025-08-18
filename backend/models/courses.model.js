// models/course.model.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
     instructor: [{
    type: String,
    trim: true,
  }],
    // instructor: [String], // Optional
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
