const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getStudentAssignments, submitAssignment, createAssignment } = require('../controllers/assignmentController');

router.use(protect);

// Student Routes
router.get('/student', getStudentAssignments); // স্টুডেন্ট তার কাজ দেখবে
router.post('/submit', submitAssignment);      // স্টুডেন্ট জমা দেবে

// Temp Route (Testing purpose - Admin/Coordinator can create)
router.post('/create', createAssignment);

module.exports = router;