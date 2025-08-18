const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    materialID: {
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
    type: {
        type: String,
        enum: ['pdf', 'video', 'document', 'link', 'image', 'other'],
        required: true
    },
    filePath: {
        type: String // For uploaded files
    },
    fileUrl: {
        type: String // For external links
    },
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lectureID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
    },
    uploadedBy: {
        type: String,
        required: true
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
