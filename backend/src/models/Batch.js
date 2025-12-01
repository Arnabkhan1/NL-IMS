// backend/src/models/Batch.js
const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a batch name'], // e.g., "MERN-B1"
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // কোন কোর্সের আন্ডারে এই ব্যাচ
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // কোন শিক্ষক ক্লাস নেবেন
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // কারা এই ব্যাচে পড়ছে
    }],
    startDate: {
        type: Date,
        required: true
    },
    schedule: {
        days: [String], // e.g., ["Mon", "Wed"]
        time: String     // e.g., "8:00 PM"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Batch', batchSchema);