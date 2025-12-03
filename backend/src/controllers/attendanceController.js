const Attendance = require('../models/Attendance');

// @desc    Mark Attendance
// @route   POST /api/attendance
const markAttendance = async (req, res) => {
    try {
        const { batchId, date, students } = req.body; 
        // date আসবে "2025-12-03" ফরম্যাটে

        console.log("Saving Attendance for Date:", date);

        const promises = students.map(async (record) => {
            // আমরা সরাসরি findOneAndUpdate ব্যবহার করছি
            return await Attendance.findOneAndUpdate(
                { 
                    batch: batchId, 
                    student: record.student, 
                    date: date // স্ট্রিং ম্যাচিং (Date Object নয়)
                },
                { status: record.status },
                { upsert: true, new: true } // না থাকলে বানাও, থাকলে আপডেট করো
            );
        });

        await Promise.all(promises);
        res.status(201).json({ message: 'Attendance Marked Successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { markAttendance };