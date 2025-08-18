const express = require('express');
const router = express.Router();
const {
    createSupportRequest,
    getAllSupportRequests,
    getAllSupportRequestsFixed,
    getAllSupportRequestsForAdmin,
    getUserSupportRequests,
    getSupportRequestById,
    updateSupportRequest,
    deleteSupportRequest,
    replyToSupportRequest
} = require('../../controllers/student/supportController');
const multer = require('multer');
const path = require('path');
const protect = require('../../middleware/authMiddleware');

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
        const support = await require('../../models/Student/supportModel').findById(req.params.id);
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

// Temporary public route for testing - remove in production
router.get('/public', async (req, res) => {
    try {
        console.log("Public support endpoint called");
        const supports = await require('../../models/Student/supportModel').find({ isDeletedByUser: false });
        console.log("Found public support requests:", supports.length);
        res.status(200).json(supports);
    } catch (error) {
        console.error("Error in public support endpoint:", error);
        res.status(500).json({ 
            message: 'Error fetching support requests', 
            error: error.message,
            stack: error.stack 
        });
    }
});

// Debug endpoint to check auth token
router.get('/debug-auth', protect, (req, res) => {
    try {
        console.log("Debug auth endpoint called");
        console.log("User from token:", req.user);
        res.status(200).json({ 
            message: 'Auth debug endpoint', 
            user: req.user,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error in debug auth endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

// Debug endpoint to test authentication and basic functionality
router.get('/test-connection', protect, async (req, res) => {
    try {
        console.log("Test connection endpoint called");
        console.log("User from token:", req.user);
        
        // Test database connection
        const Support = require('../../models/Student/supportModel');
        const count = await Support.countDocuments();
        
        res.status(200).json({ 
            message: 'Connection test successful',
            user: req.user,
            totalSupportRequests: count,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error in test connection endpoint:", error);
        res.status(500).json({ 
            message: 'Test connection failed',
            error: error.message,
            stack: error.stack
        });
    }
});

// Debug endpoint to inspect support requests in database
router.get('/debug-db', protect, async (req, res) => {
    try {
        console.log("Debug DB endpoint called");
        console.log("User from token:", req.user);
        
        const Support = require('../../models/Student/supportModel');
        
        // Get all support requests with details
        const allSupports = await Support.find({}).select('studentID studentName isDeletedByUser status createdAt').limit(10);
        
        // Get count by different criteria
        const totalCount = await Support.countDocuments();
        const userCount = await Support.countDocuments({ studentID: req.user.id });
        const userCountStr = await Support.countDocuments({ studentID: req.user.id.toString() });
        const nonDeletedCount = await Support.countDocuments({ isDeletedByUser: { $ne: true } });
        
        res.status(200).json({ 
            message: 'Database debug info',
            userFromToken: req.user,
            totalSupportRequests: totalCount,
            userRequestsById: userCount,
            userRequestsByIdString: userCountStr,
            nonDeletedRequests: nonDeletedCount,
            sampleRequests: allSupports.map(req => ({
                id: req._id,
                studentID: req.studentID,
                studentIDType: typeof req.studentID,
                studentName: req.studentName,
                isDeletedByUser: req.isDeletedByUser,
                status: req.status,
                createdAt: req.createdAt
            }))
        });
    } catch (error) {
        console.error("Error in debug DB endpoint:", error);
        res.status(500).json({ 
            message: 'Debug DB endpoint failed',
            error: error.message,
            stack: error.stack
        });
    }
});

// Routes
router.post('/', protect, upload.single('photo'), createSupportRequest);
router.get('/', protect, getAllSupportRequests);
router.get('/fixed', protect, getAllSupportRequestsFixed); // Alternative endpoint with better error handling
router.get('/user', protect, getUserSupportRequests); // Simple endpoint for user's own requests
router.get('/admin', getAllSupportRequestsForAdmin); // Dedicated admin endpoint (no auth required)
router.get('/:id', protect, getSupportRequestById);
router.put('/:id', protect, upload.single('photo'), updateSupportRequest);
router.delete('/:id', protect, deleteSupportRequest);
router.delete('/:id/admin', deleteSupportRequest); // Admin delete endpoint (no auth required)
router.post('/:id/reply', replyToSupportRequest); // Admin reply endpoint (no auth required)
router.post('/:id/admin-reply', replyToSupportRequest); // Alternative admin reply endpoint

module.exports = router;
