// backend/src/utils/tokenGenerator.js
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // টোকেনটি ৩০ দিন পর্যন্ত ভ্যালিড থাকবে
    });
};

module.exports = generateToken;