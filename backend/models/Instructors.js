const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    instructorID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String
    },
    coursesAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Instructor', instructorSchema);
