const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
    assignmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    submissionFile: {
        type: String, // File path or URL
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    grade: {
        type: Number,
        min: 0,
        max: 100
    },
    feedback: {
        type: String
    },
    status: {
        type: String,
        enum: ['submitted', 'graded', 'late'],
        default: 'submitted'
    },
    gradedBy: {
        type: String
    },
    gradedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
