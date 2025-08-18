const Support = require('../../models/Lecturesupportmodel');

const createSupportRequest = async (req, res) => {
    try {
        const { lectureID, lectureName, email, contactNumber, issue } = req.body;
        const photo = req.file ? req.file.filename : null;

        const newSupport = new Support({
            lectureID,
            lectureName,
            email,
            contactNumber,
            issue,
            photo
        });        await newSupport.save();
        res.status(201).json({ message: 'Support request created successfully', data: newSupport });
    } catch (error) {
        console.error('Support request creation error:', error);
        res.status(500).json({ message: 'Error creating support request', error: error.message });
    }
};

const getAllSupportRequests = async (req, res) => {
    try {
        // Check if the request is coming from the admin dashboard
        const isAdmin = req.query.isAdmin === 'true';
        console.log("Get all requests, isAdmin:", isAdmin);
        
        let query = {};
        if (!isAdmin) {
            query.isDeletedByUser = false;
            console.log("Adding isDeletedByUser=false filter");
        }
        
        console.log("Query:", query);
        const supports = await Support.find(query);
        console.log("Found support requests:", supports.length);
        res.status(200).json(supports);
    } catch (error) {
        console.error("Error in getAllSupportRequests:", error);
        res.status(500).json({ message: 'Error fetching support requests', error: error.message });
    }
};

const getSupportRequestById = async (req, res) => {
    try {
        const support = await Support.findById(req.params.id);
        if (!support) {
            return res.status(404).json({ message: 'Support request not found' });
        }
        res.status(200).json(support);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching support request', error: error.message });
    }
};

const updateSupportRequest = async (req, res) => {
    try {
        const { lectureID, lectureName, title, email, contactNumber, issue } = req.body;
        const photo = req.file ? req.file.filename : null;

        const updatedFields = {
            lectureID,
            title,
            lectureName,
            email,
            contactNumber,
            issue
        };

        if (photo) {
            updatedFields.photo = photo;
        }

        const updatedSupport = await Support.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true } // return updated document
        );

        if (!updatedSupport) {
            return res.status(404).json({ message: 'Support request not found' });
        }

        res.status(200).json({ message: 'Support request updated successfully', data: updatedSupport });
    } catch (error) {
        res.status(500).json({ message: 'Error updating support request', error: error.message });
    }
};

const deleteSupportRequest = async (req, res) => {
    try {
        console.log("Delete request params:", req.params);
        console.log("Delete request query:", req.query);
        
        const supportId = req.params.id;
        console.log("Looking for support request with ID:", supportId);
        
        const support = await Support.findById(supportId);
        console.log("Found support request:", support ? "Yes" : "No");
        
        if (!support) {
            return res.status(404).json({ message: 'Support request not found' });
        }
        
        // Check if the request is coming from the admin dashboard
        const isAdmin = req.query.isAdmin === 'true';
        console.log("Is admin request:", isAdmin);
        
        // If it's from admin, only allow deletion of 'replied' requests
        if (isAdmin && support.status !== 'replied') {
            return res.status(403).json({ message: 'Only replied requests can be deleted by admin' });
        }
        
        if (!isAdmin) {
            console.log("Performing soft delete (Instructor)");
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
        
        res.status(200).json({ message: 'Support request deleted successfully' });
    } catch (error) {
        console.error("Delete error in controller:", error);
        res.status(500).json({ 
            message: 'Error deleting support request', 
            error: error.message,
            stack: error.stack
        });
    }
};

// New function to handle admin replies
const replyToSupportRequest = async (req, res) => {
    try {
        const { message, adminName } = req.body;
        
        if (!message || !adminName) {
            return res.status(400).json({ message: 'Reply message and admin name are required' });
        }
        
        const support = await Support.findById(req.params.id);
        
        if (!support) {
            return res.status(404).json({ message: 'Support request not found' });
        }
        
        // Update the support request with admin reply
        support.adminReply = {
            message,
            repliedAt: new Date(),
            adminName
        };
        support.status = 'replied';
        
        await support.save();
        
        res.status(200).json({ 
            message: 'Reply sent successfully', 
            data: support 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error sending reply', 
            error: error.message 
        });
    }
};

module.exports = {
    createSupportRequest,
    getAllSupportRequests,
    getSupportRequestById,
    updateSupportRequest,
    deleteSupportRequest,
    replyToSupportRequest
};
