const { readData } = require('../utils/dataHandler');

// GET /admin/users
exports.getAllUsers = (req, res) => {
    try {
        const users = readData('users');

        //removes passwords from all user objects
        const safeUsers = users.map(user => {
            const { password, ...safeData } = user;
            return safeData;
        });

        res.status(200).json({
            success: true,
            count: safeUsers.length,
            users: safeUsers
        });
    } catch (error) {
        console.error("Error fetching admin users:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /admin/stats
exports.getSystemStats = (req, res) => {
    try {
        const users = readData('users');
        const jobs = readData('jobs');
        const applications = readData('applications');

        // Calculate breakdowns
        const seekersCount = users.filter(u => u.role === 'seeker').length;
        const employersCount = users.filter(u => u.role === 'employer').length;

        const shortlistedCount = applications.filter(app => app.status === 'shortlisted').length;

        //Calculate conversion rate (Percentage of applications that lead to shortlisting)
        const conversionRate = applications.length > 0
            ? ((shortlistedCount / applications.length) * 100).toFixed(2) + '%'
            : '0%';

        res.status(200).json({
            success: true,
            stats: {
                totalUsers: users.length,
                roles: {
                    seekers: seekersCount,
                    employers: employersCount
                },
                totalJobs: jobs.length,
                totalApplications: applications.length,
                shortlistedCount: shortlistedCount,
                applicationSuccessRate: conversionRate
            }
        });
    } catch (error) {
        console.error("Error generating admin stats:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};