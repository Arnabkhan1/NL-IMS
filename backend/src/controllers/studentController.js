const Batch = require('../models/Batch');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');

// @desc    Get Student Dashboard Data
// @route   GET /api/student/dashboard
const getStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user._id;
        
        // Debugging logs (টার্মিনালে দেখবেন)
        console.log("Fetching dashboard for student:", studentId);

        // ১. ছাত্রের এনরোল করা ব্যাচ খুঁজে বের করা
        // students array তে studentId আছে কিনা চেক করছি
        const myBatches = await Batch.find({ students: studentId })
            .populate('course', 'title price')
            .populate('teacher', 'name email');

        // ২. ছাত্রের পেমেন্ট হিস্ট্রি খুঁজে বের করা
        const myPayments = await Payment.find({ student: studentId })
            .populate('batch', 'name')
            .sort({ paymentDate: -1 });

        console.log(`Found ${myBatches.length} batches and ${myPayments.length} payments.`);

        res.json({
            batches: myBatches,
            payments: myPayments
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get My Attendance History
const getMyAttendance = async (req, res) => {
    try {
        const studentId = req.user._id;
        
        console.log("Fetching attendance for student:", studentId);

        const attendance = await Attendance.find({ student: studentId })
            .populate('batch', 'name') // ব্যাচের নাম দেখানোর জন্য
            .sort({ date: -1 }); // নতুন তারিখ আগে

        console.log(`Found ${attendance.length} records.`);

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { 
    getStudentDashboard, 
    getMyAttendance 
};