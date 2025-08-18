const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    studentID: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    photo: {
        type: String // path to uploaded photo
    },
    status: {
        type: String,
        enum: ['pending', 'replied'],
        default: 'pending'
    },
    isDeletedByUser: {
        type: Boolean,
        default: false
    },
    adminReply: {
        message: {
            type: String,
            default: ''
        },
        repliedAt: {
            type: Date
        },
        adminName: {
            type: String
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema);
