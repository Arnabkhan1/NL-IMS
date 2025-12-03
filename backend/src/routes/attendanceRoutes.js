const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { markAttendance } = require('../controllers/attendanceController');

// টিচার এবং এডমিন হাজিরা নিতে পারবে
router.post('/', protect, authorize('teacher', 'admin'), markAttendance);

module.exports = router;