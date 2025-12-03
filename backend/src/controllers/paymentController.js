// backend/src/controllers/paymentController.js
const Payment = require('../models/Payment');

// @desc    Add new payment
// @route   POST /api/payments
const createPayment = async (req, res) => {
    try {
        // transactionId যোগ করা হলো
        const { student, batch, amount, paymentMethod, remarks, date, transactionId } = req.body;

        const payment = await Payment.create({
            student,
            batch,
            amount,
            paymentMethod,
            transactionId: transactionId || '', // যদি ক্যাশ হয়, তবে ফাঁকা থাকবে
            remarks,
            paymentDate: date || Date.now()
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get all payment history
// @route   GET /api/payments
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('student', 'name email') // স্টুডেন্টের নাম দেখাবে
            .populate('batch', 'name')         // ব্যাচের নাম দেখাবে
            .sort({ paymentDate: -1 });        // নতুন পেমেন্ট আগে দেখাবে

        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPayment, getPayments };