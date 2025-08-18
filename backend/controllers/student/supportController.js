const Support = require('../../models/Student/supportModel');

const createSupportRequest = async (req, res) => {
    try {
        const { studentName, email, contactNumber, issue } = req.body;
        const photo = req.file ? req.file.filename : null;

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Use studentID from JWT token instead of form data
        const studentID = req.user.id;

        const newSupport = new Support({
            studentID,
            studentName,
            email,
            contactNumber,
            issue,
            photo
        });
        
        await newSupport.save();
        res.status(201).json({ message: 'Support request created successfully', data: newSupport });
    } catch (error) {
        console.error('Support request creation error:', error);
        res.status(500).json({ message: 'Error creating support request', error: error.message });
    }
};

const getAllSupportRequests = async (req, res) => {
    try {
        console.log("getAllSupportRequests called");
        console.log("req.user:", req.user);
        console.log("req.query:", req.query);
        
        // Check if the request is coming from the admin dashboard
        const isAdmin = req.query.isAdmin === 'true';
        console.log("Get all requests, isAdmin:", isAdmin);
        
        let query = {};
        
        if (!isAdmin) {
            // Validate user authentication for non-admin requests
            if (!req.user || !req.user.id) {
                console.error("No user found in request despite protect middleware");
                return res.status(401).json({ message: 'Authentication required' });
            }
            
            // For regular users, show only their own requests that aren't deleted
            const userIdString = req.user.id.toString();
            query = { studentID: userIdString };
            console.log("User authenticated with ID:", userIdString, "filtering by student ID");
        } else {
            // For admin view, show all requests (no user authentication required for admin)
            console.log("Admin view: showing all requests");
            query = {};
        }
        
        console.log("Final query:", JSON.stringify(query));
        
        // Get the documents and filter in JavaScript to avoid MongoDB query issues
        let supports = await Support.find(query).sort({ createdAt: -1 });
        console.log("Found support requests before filtering:", supports.length);
        
        // Filter out deleted requests in JavaScript
        supports = supports.filter(support => !support.isDeletedByUser);
        console.log("Found support requests after filtering:", supports.length);
        
        // For admin requests, provide additional metadata
        if (isAdmin) {
            console.log("Admin request - providing detailed response");
            const totalRequests = supports.length;
            const pendingRequests = supports.filter(req => req.status === 'pending').length;
            const repliedRequests = supports.filter(req => req.status === 'replied').length;
            
            console.log(`Admin stats: Total: ${totalRequests}, Pending: ${pendingRequests}, Replied: ${repliedRequests}`);
        }
        
        res.status(200).json(supports);
    } catch (error) {
        console.error("Error in getAllSupportRequests:", error);
        console.error("Error stack:", error.stack);
        
        res.status(500).json({ 
            message: 'Error fetching support requests', 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Alternative method with enhanced error handling and flexible user ID matching
const getAllSupportRequestsFixed = async (req, res) => {
    try {
        console.log("getAllSupportRequestsFixed called");
        console.log("req.user:", req.user);
        console.log("req.query:", req.query);
        
        // Check if the request is coming from the admin dashboard
        const isAdmin = req.query.isAdmin === 'true';
        console.log("Get all requests, isAdmin:", isAdmin);
        
        // Validate user authentication for non-admin requests
        if (!isAdmin && (!req.user || !req.user.id)) {
            console.error("No user found in request despite protect middleware");
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        let query = {};
        
        if (!isAdmin) {
            // For regular users, show only their own requests
            const userIdString = req.user.id.toString();
            query = { studentID: userIdString };
            console.log("User authenticated with ID:", userIdString, "using simple matching");
        } else {
            // For admin view, show all requests
            console.log("Admin view: showing all requests");
            query = {};
        }
        
        console.log("Final query:", JSON.stringify(query));
        
        // Get all matching documents and filter in JavaScript
        let supports = await Support.find(query).sort({ createdAt: -1 });
        console.log("Found support requests before filtering:", supports.length);
        
        // Filter out deleted requests in JavaScript (safer than MongoDB query)
        supports = supports.filter(support => !support.isDeletedByUser);
        console.log("Found support requests after filtering:", supports.length);
        
        res.status(200).json(supports);
    } catch (error) {
        console.error("Error in getAllSupportRequestsFixed:", error);
        res.status(500).json({ 
            message: 'Error fetching support requests', 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getSupportRequestById = async (req, res) => {
    try {
        const support = await Support.findById(req.params.id);
        
        if (!support) {
            return res.status(404).json({ message: 'Support request not found' });
        }
        
        // Check if it's an admin request
        const isAdmin = req.query.isAdmin === 'true';
        
        // For non-admin users, only allow access to their own requests
        if (!isAdmin && support.studentID !== req.user.id) {
            return res.status(403).json({ message: 'Access denied - You can only view your own requests' });
        }
        
        res.status(200).json(support);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching support request', error: error.message });
    }
};

const updateSupportRequest = async (req, res) => {
    try {
        const { studentName, title, email, contactNumber, issue } = req.body;
        const photo = req.file ? req.file.filename : null;

        // First, check if the support request exists
        const support = await Support.findById(req.params.id);
        
        if (!support) {
            return res.status(404).json({ message: 'Support request not found' });
        }
        
        // Check if the request is coming from the admin dashboard
        const isAdmin = req.query.isAdmin === 'true';
        
        // For non-admin users, verify ownership
        if (!isAdmin && support.studentID !== req.user.id) {
            return res.status(403).json({ message: 'Access denied - You can only update your own requests' });
        }

        // Use studentID from JWT token for non-admin users
        const updatedFields = {
            title,
            studentName,
            email,
            contactNumber,
            issue
        };
        
        // Only update studentID if admin is making the change
        if (isAdmin) {
            updatedFields.studentID = req.body.studentID;
        }

        if (photo) {
            updatedFields.photo = photo;
        }

        const updatedSupport = await Support.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true } // return updated document
        );

        res.status(200).json({ message: 'Support request updated successfully', data: updatedSupport });
    } catch (error) {
        res.status(500).json({ message: 'Error updating support request', error: error.message });
    }
};

const deleteSupportRequest = async (req, res) => {
    try {
        console.log("Delete request params:", req.params);
        console.log("Delete request query:", req.query);
        console.log("Delete request user:", req.user);
        
        const supportId = req.params.id;
        console.log("Looking for support request with ID:", supportId);
        
        const support = await Support.findById(supportId);
        console.log("Found support request:", support ? "Yes" : "No");
        
        if (!support) {
            return res.status(404).json({ message: 'Support request not found' });
        }
        
        // Check if the request is coming from the admin dashboard
        const isAdmin = req.query.isAdmin === 'true' || req.path.includes('/admin');
        console.log("Is admin request:", isAdmin);
        
        // For non-admin users, verify ownership and authentication
        if (!isAdmin) {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            
            if (support.studentID !== req.user.id) {
                return res.status(403).json({ message: 'Access denied - You can only delete your own requests' });
            }
        }
        
        // If it's from admin, only allow deletion of 'replied' requests
        if (isAdmin && support.status !== 'replied') {
            return res.status(403).json({ message: 'Only replied requests can be deleted by admin' });
        }
        
        // For students, we mark as deleted by user
        if (!isAdmin) {
            console.log("Performing soft delete (student)");
            // Don't modify the status field, just update isDeletedByUser
            await Support.findByIdAndUpdate(
                supportId,
                { isDeletedByUser: true },
                { new: true }
            );
            console.log("Support request marked as deleted by user");
        } else {
            // For admin, actually delete the record for 'replied' requests
            console.log("Performing hard delete (admin)");
            await Support.findByIdAndDelete(supportId);
            console.log("Support request permanently deleted");
        }
        
        res.status(200).json({ 
            message: 'Support request deleted successfully',
            success: true
        });
    } catch (error) {
        console.error("Delete error in controller:", error);
        res.status(500).json({ 
            message: 'Error deleting support request', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// New function to handle admin replies
const replyToSupportRequest = async (req, res) => {
    try {
        console.log('Reply request received for ID:', req.params.id);
        console.log('Request body:', req.body);
        
        const { message, adminName } = req.body;
        
        if (!message || !adminName) {
            console.log('Missing required fields:', { message: !!message, adminName: !!adminName });
            return res.status(400).json({ 
                message: 'Reply message and admin name are required',
                received: { message: !!message, adminName: !!adminName }
            });
        }
        
        const supportId = req.params.id;
        console.log('Looking for support request with ID:', supportId);
        
        const support = await Support.findById(supportId);
        
        if (!support) {
            console.log('Support request not found with ID:', supportId);
            return res.status(404).json({ message: 'Support request not found' });
        }
        
        console.log('Found support request:', {
            id: support._id,
            studentName: support.studentName,
            currentStatus: support.status
        });
        
        // Update the support request with admin reply
        support.adminReply = {
            message: message.trim(),
            repliedAt: new Date(),
            adminName: adminName.trim()
        };
        support.status = 'replied';
        
        console.log('Updating support request with reply...');
        await support.save();
        
        console.log('Support request updated successfully');
        
        res.status(200).json({ 
            message: 'Reply sent successfully', 
            data: support,
            success: true
        });
    } catch (error) {
        console.error('Error in replyToSupportRequest:', error);
        res.status(500).json({ 
            message: 'Error sending reply', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Simple function to get only user's own support requests
const getUserSupportRequests = async (req, res) => {
    try {
        console.log("getUserSupportRequests called");
        console.log("User ID from token:", req.user?.id);
        
        // Validate user authentication
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        // Simple query - just get user's own requests
        const userIdString = req.user.id.toString();
        
        // First, try to get all user's requests without any additional filters
        let supports = await Support.find({ studentID: userIdString }).sort({ createdAt: -1 });
        console.log("Found all user requests:", supports.length);
        
        // Then filter out deleted ones in JavaScript (safer than MongoDB query)
        supports = supports.filter(support => !support.isDeletedByUser);
        console.log("After filtering deleted requests:", supports.length);
        
        res.status(200).json(supports);
    } catch (error) {
        console.error("Error in getUserSupportRequests:", error);
        res.status(500).json({ 
            message: 'Error fetching user support requests', 
            error: error.message
        });
    }
};

// Dedicated function for admin to get all support requests (no authentication required)
const getAllSupportRequestsForAdmin = async (req, res) => {
    try {
        console.log("getAllSupportRequestsForAdmin called");
        console.log("Admin accessing all support requests");
        
        // Get all support requests without any user filtering
        let supports = await Support.find({}).sort({ createdAt: -1 });
        console.log("Found total support requests:", supports.length);
        
        // Filter out deleted requests in JavaScript
        supports = supports.filter(support => !support.isDeletedByUser);
        console.log("Found support requests after filtering deleted ones:", supports.length);
        
        // Provide statistics
        const totalRequests = supports.length;
        const pendingRequests = supports.filter(req => req.status === 'pending').length;
        const repliedRequests = supports.filter(req => req.status === 'replied').length;
        
        console.log(`Admin request stats: Total: ${totalRequests}, Pending: ${pendingRequests}, Replied: ${repliedRequests}`);
        
        res.status(200).json(supports);
    } catch (error) {
        console.error("Error in getAllSupportRequestsForAdmin:", error);
        res.status(500).json({ 
            message: 'Error fetching support requests for admin', 
            error: error.message
        });
    }
};

module.exports = {
    createSupportRequest,
    getAllSupportRequests,
    getAllSupportRequestsFixed,
    getSupportRequestById,
    updateSupportRequest,
    deleteSupportRequest,
    replyToSupportRequest,
    getUserSupportRequests,
    getAllSupportRequestsForAdmin
};
