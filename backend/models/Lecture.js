const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  fileUrl: { // URL to the lecture PDF, video, etc.
    type: String,
    required: true,
  },
  // Add other lecture-specific fields as needed
}, {
  timestamps: true,
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;