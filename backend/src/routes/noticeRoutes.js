// backend/src/routes/noticeRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { createNotice, getStudentNotices } = require('../controllers/noticeController');

router.use(protect);

// Admin নোটিশ তৈরি করবে
router.post('/', authorize('admin'), createNotice);

// Student নোটিশ দেখবে
router.get('/student', authorize('student'), getStudentNotices);

module.exports = router;