// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { getUsersByRole, createUser } = require('../controllers/userController');

// ১. নিজের প্রোফাইল দেখা (সবাই পারবে)
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

// ==========================================
// 🔒 ADMIN ONLY ROUTES (নিচের সব রাউটে Admin হতে হবে)
// ==========================================

// ২. নির্দিষ্ট রোলের ইউজার লিস্ট দেখা (যেমন: সব Student)
router.get('/role/:role', protect, authorize('admin'), getUsersByRole);

// ৩. নতুন ইউজার তৈরি করা (Teacher/Student)
router.post('/', protect, authorize('admin'), createUser);

module.exports = router;