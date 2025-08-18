const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    examID: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    instructorID: {
        type: String,
        required: true
    },
    examDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // Duration in minutes
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            type: String
        }],
        correctAnswer: {
            type: String,
            required: true
        },
        marks: {
            type: Number,
            required: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
