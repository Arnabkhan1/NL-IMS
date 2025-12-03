// backend/src/controllers/noticeController.js
const Notice = require('../models/Notice');

// @desc    Create a Notice (Admin Only)
// @route   POST /api/notices
const createNotice = async (req, res) => {
    try {
        const { title, message, targetAudience } = req.body;
        
        const notice = await Notice.create({
            title,
            message,
            targetAudience,
            postedBy: req.user._id
        });

        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Notices for Student
// @route   GET /api/notices/student
const getStudentNotices = async (req, res) => {
    try {
        // স্টুডেন্ট দেখবে সেই নোটিশগুলো যা 'all' অথবা 'student' এর জন্য
        const notices = await Notice.find({ 
            targetAudience: { $in: ['all', 'student'] } 
        }).sort({ createdAt: -1 }); // নতুন নোটিশ আগে

        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createNotice, getStudentNotices };