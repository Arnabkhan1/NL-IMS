// backend/src/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/tokenGenerator');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // ১. চেক করি সব তথ্য দিয়েছে কিনা
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // ২. চেক করি ইউজার আগে থেকেই আছে কিনা
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // ৩. নতুন ইউজার তৈরি করি
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student' // রোল না দিলে অটোমেটিক student হবে
        });

        // ৪. সফল হলে রেসপন্স পাঠাই
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id) // সাথে টোকেনও পাঠিয়ে দিচ্ছি
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ১. ইমেইল দিয়ে ইউজার খুঁজি
        const user = await User.findOne({ email }).select('+password'); 
        // নোট: select('+password') দিচ্ছি কারণ মডেলে password field-এ select: false দেওয়া ছিল।

        // ২. ইউজার আছে কিনা এবং পাসওয়ার্ড মিলছে কিনা চেক করি
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id) // লগিন সফল হলে টোকেন দিচ্ছি
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser, 
};