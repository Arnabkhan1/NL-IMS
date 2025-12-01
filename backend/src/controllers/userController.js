// backend/src/controllers/userController.js
const User = require('../models/User');

// @desc    Get all users by role (e.g., get all students)
// @route   GET /api/users/role/:role
// @access  Private (Admin)
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params; // URL থেকে রোল নেব (student/teacher)
        
        // পাসওয়ার্ড ছাড়া বাকি ডাটা আনব
        const users = await User.find({ role }).select('-password');
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new user (Student/Teacher) by Admin
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // চেক করি ইউজার আগে আছে কিনা
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // ইউজার তৈরি (পাসওয়ার্ড অটোমেটিক হ্যাশ হবে User মডেলে)
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsersByRole,
    createUser
};