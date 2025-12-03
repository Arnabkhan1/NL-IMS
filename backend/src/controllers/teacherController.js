// backend/src/controllers/teacherController.js
const Batch = require('../models/Batch');

// @desc    Get Teacher Dashboard (My Assigned Batches)
// @route   GET /api/teacher/dashboard
const getTeacherDashboard = async (req, res) => {
    try {
        const teacherId = req.user._id; // লগইন করা টিচারের ID

        // ডাটাবেস থেকে খুঁজছি কোন ব্যাচগুলোতে এই টিচার আছেন
        const myBatches = await Batch.find({ teacher: teacherId })
            .populate('course', 'title') // কোর্সের নাম
            .populate('students', 'name email'); // ছাত্রদের লিস্ট (হাজিরা নেওয়ার জন্য লাগবে)

        res.json({
            batches: myBatches,
            count: myBatches.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTeacherDashboard };