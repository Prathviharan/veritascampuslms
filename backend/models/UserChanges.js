const mongoose = require('mongoose');

const userChangesSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        required: true
    },
    changeType: {
        type: String,
        enum: ['password_change', 'profile_update', 'email_change'],
        required: true
    },
    oldValue: {
        type: String
    },
    newValue: {
        type: String
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    processedBy: {
        type: String
    },
    processedAt: {
        type: Date
    },
    reason: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('UserChanges', userChangesSchema);
