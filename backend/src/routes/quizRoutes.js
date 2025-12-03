const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getStudentQuizzes, getQuizById, submitQuiz, createQuiz } = require('../controllers/quizController');

router.use(protect);

// Student Routes
router.get('/student', getStudentQuizzes);      // কুইজ লিস্ট দেখা
router.get('/:id', getQuizById);                // পরীক্ষা দেওয়া (প্রশ্ন লোড করা)
router.post('/submit', submitQuiz);             // উত্তর জমা দেওয়া

// Admin Route (Testing)
router.post('/create', createQuiz);

module.exports = router;