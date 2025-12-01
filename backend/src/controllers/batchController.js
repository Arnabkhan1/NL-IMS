// backend/src/controllers/batchController.js
const Batch = require('../models/Batch');

// @desc    Create a new batch
// @route   POST /api/batches
const createBatch = async (req, res) => {
    try {
        const { name, course, teacher, startDate, days, time } = req.body;

        const batch = await Batch.create({
            name,
            course,
            teacher,
            startDate,
            schedule: { days, time }
        });

        // আমরা পপুলেট করছি যাতে রেজাল্টে টিচার/কোর্সের নাম দেখা যায়
        const populatedBatch = await Batch.findById(batch._id)
            .populate('course', 'title')
            .populate('teacher', 'name');

        res.status(201).json(populatedBatch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all batches
// @route   GET /api/batches
const getBatches = async (req, res) => {
    try {
        const batches = await Batch.find()
            .populate('course', 'title')       // কোর্সের নাম দেখাবে
            .populate('teacher', 'name')       // শিক্ষকের নাম দেখাবে
            .populate('students', 'name email'); // ছাত্রদের তথ্য দেখাবে

        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enroll Student to a Batch
// @route   POST /api/batches/:id/enroll
const enrollStudent = async (req, res) => {
    try {
        const { studentId } = req.body; // আমরা ফ্রন্টএন্ড থেকে ছাত্রের ID পাঠাবো
        const batchId = req.params.id;

        const batch = await Batch.findById(batchId);
        
        if(!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // চেক করি ছাত্র আগেই এই ব্যাচে আছে কিনা
        if(batch.students.includes(studentId)) {
            return res.status(400).json({ message: 'Student already enrolled' });
        }

        batch.students.push(studentId);
        await batch.save();

        res.json({ message: 'Student enrolled successfully', batch });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBatch,
    getBatches,
    enrollStudent
};