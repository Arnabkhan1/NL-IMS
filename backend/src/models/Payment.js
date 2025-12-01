// backend/src/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Bkash', 'Nagad', 'Bank'],
        default: 'Cash'
    },
    remarks: {
        type: String, // যেমন: "January Month Fee"
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);