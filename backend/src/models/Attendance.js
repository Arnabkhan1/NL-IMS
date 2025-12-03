const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        required: true
    }
}, {
    timestamps: true
});

// একজন ছাত্রের একই দিনে একই ব্যাচে একবারের বেশি হাজিরা নেওয়া যাবে না
attendanceSchema.index({ batch: 1, student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);