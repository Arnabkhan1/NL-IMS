// backend/src/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { getTeacherDashboard } = require('../controllers/teacherController');

// এই রাউটে ঢুকতে হলে অবশ্যই লগইন থাকতে হবে এবং রোল 'teacher' হতে হবে
router.get('/dashboard', protect, authorize('teacher'), getTeacherDashboard);

module.exports = router;