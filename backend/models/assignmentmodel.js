const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
  visibility: { type: String, enum: ['Public', 'Private'], required: true },
  deadline: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
