const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { getStudentDashboard, getMyAttendance } = require('../controllers/studentController');

// URL: /api/student/dashboard
router.get('/dashboard', protect, authorize('student'), getStudentDashboard);

// URL: /api/student/attendance
router.get('/attendance', protect, authorize('student'), getMyAttendance);

module.exports = router;