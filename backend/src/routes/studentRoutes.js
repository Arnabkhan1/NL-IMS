// backend/src/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// কন্ট্রোলার ইম্পোর্ট করছি (খেয়াল করুন বানান ঠিক আছে কিনা)
const { getStudentDashboard, getMyAttendance } = require('../controllers/studentController');

// ডিবাগিংয়ের জন্য মডেল
const Batch = require('../models/Batch');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');

// ==========================
// 🎓 STUDENT ROUTES
// ==========================

// ১. ড্যাশবোর্ড
router.get('/dashboard', protect, authorize('student'), getStudentDashboard);

// ২. হাজিরা
router.get('/attendance', protect, authorize('student'), getMyAttendance);

// ৩. 🛠️ DEBUG ROUTE
router.get('/debug-me', protect, async (req, res) => {
    try {
        const studentId = req.user._id;
        console.log("👉 CURRENT USER ID:", studentId);

        const batchCount = await Batch.countDocuments({ students: studentId });
        const paymentCount = await Payment.countDocuments({ student: studentId });
        const attendanceCount = await Attendance.countDocuments({ student: studentId });

        res.json({
            id: studentId,
            inBatches: batchCount,
            inPayments: paymentCount,
            inAttendance: attendanceCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;