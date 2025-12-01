// backend/src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { createCourse, getCourses } = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// ১. কোর্স দেখা (সবাই পারবে)
router.get('/', getCourses);

// ২. কোর্স তৈরি করা (শুধুমাত্র Admin পারবে)
router.post('/', protect, authorize('admin'), createCourse);

module.exports = router;