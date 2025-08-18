const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    mobile: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true,
    },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
