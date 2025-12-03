// backend/src/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    
    // 👇👇 পেমেন্ট মেথডগুলো খেয়াল করুন (বানান যেন হুবহু মিলে)
    paymentMethod: {
        type: String,
        enum: ['Cash','Bank'], 
        default: 'Cash'
    },
    
    // 👇👇 নতুন ফিল্ড (TrxID রাখার জন্য)
    transactionId: { 
        type: String, 
        trim: true 
    },

    remarks: { type: String, trim: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);