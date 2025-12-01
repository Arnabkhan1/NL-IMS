// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // ১. চেক করি হেডারে টোকেন আছে কিনা এবং সেটা 'Bearer' দিয়ে শুরু কিনা
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // ২. টোকেনটি বের করে নিই (Bearer <token> থেকে শুধু <token> অংশটি)
            token = req.headers.authorization.split(' ')[1];

            // ৩. টোকেনটি ভেরিফাই করি
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ৪. টোকেন সঠিক হলে, ডাটাবেস থেকে ইউজার খুঁজে বের করি
            // (পাসওয়ার্ড ছাড়া বাকি সব তথ্য req.user-এ রেখে দিই)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // পরের ধাপে যাওয়ার অনুমতি দিলাম
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };