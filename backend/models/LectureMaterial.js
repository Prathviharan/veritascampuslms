const mongoose = require("mongoose");

const lectureMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  week: String,
  visibility: String,
  fileUrl: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

module.exports = mongoose.model("LectureMaterial", lectureMaterialSchema);