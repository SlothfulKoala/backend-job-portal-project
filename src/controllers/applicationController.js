const { readData, writeData } = require('../utils/dataHandler');

// PATCH /shortlist
exports.shortlistApplication = (req, res) => {
    try {
        const { applicationId } = req.body;

        if (!applicationId) {
            return res.status(400).json({ message: 'Application ID is required' });
        }

        const applications = readData('applications');

        // Find the application by its ID
        const appIndex = applications.findIndex(app => app.id === applicationId);

        if (appIndex === -1) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update the status
        applications[appIndex].status = 'shortlisted';

        // Save the updated array back to the file
        writeData('applications', applications);

        res.status(200).json({ 
            message: 'Application shortlisted successfully', 
            application: applications[appIndex] 
        });
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};