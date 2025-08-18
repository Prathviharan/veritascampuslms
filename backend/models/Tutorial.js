const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  fileUrl: { // URL to the tutorial PDF, video, etc.
    type: String,
    required: true,
  },
  // Add other tutorial-specific fields as needed
}, {
  timestamps: true,
});

const Tutorial = mongoose.model('Tutorial', tutorialSchema);

module.exports = Tutorial;