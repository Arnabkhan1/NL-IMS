// backend/src/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true
    },
    courseCode: {
        type: String,
        required: true,
        unique: true, // যেমন: CSE101
        uppercase: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    duration: {
        type: String, // e.g., "3 Months"
        required: true
    },
    thumbnail: {
        type: String, // ইমেজের URL থাকবে
        default: 'https://via.placeholder.com/150'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // কোন শিক্ষক নিচ্ছেন
        required: false // আপাতত false রাখলাম, পরে assign করব
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);