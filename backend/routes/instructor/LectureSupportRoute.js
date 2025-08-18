const express = require('express');
const router = express.Router();
const {
    createSupportRequest,
    getAllSupportRequests,
    getSupportRequestById,
    updateSupportRequest,
    deleteSupportRequest,
    replyToSupportRequest
} = require('../../controllers/instructor/lectureSupportController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // appending extension
    }
});

const upload = multer({ storage: storage });

// Test endpoint for debugging
router.get('/test-params', (req, res) => {
    console.log('Test endpoint called');
    console.log('Query params:', req.query);
    res.status(200).json({ 
        message: 'Test endpoint', 
        params: req.query,
        isAdminString: req.query.isAdmin,
        isAdminBool: req.query.isAdmin === 'true'
    });
});

// Debug endpoint to check a support request's status
router.get('/debug/:id', async (req, res) => {
    try {
        const support = await require('../../models/Lecturesupportmodel').findById(req.params.id);
        if (!support) {
            return res.status(404).json({ message: 'Support request not found' });
        }
        res.status(200).json({
            id: support._id,
            status: support.status,
            statusType: typeof support.status,
            isDeletedByUser: support.isDeletedByUser,
            allFields: support
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes
router.post('/', upload.single('photo'), createSupportRequest);
router.get('/', getAllSupportRequests);
router.get('/:id', getSupportRequestById);
router.put('/:id', upload.single('photo'), updateSupportRequest); // FULL UPDATE Route
router.delete('/:id', deleteSupportRequest);
router.post('/:id/reply', replyToSupportRequest); // New route for admin replies

module.exports = router;
