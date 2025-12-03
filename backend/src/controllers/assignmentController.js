const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Batch = require('../models/Batch');

// @desc    Get Assignments for Student (Based on Enrolled Batches)
// @route   GET /api/assignments/student
const getStudentAssignments = async (req, res) => {
    try {
        const studentId = req.user._id;

        // ১. ছাত্র কোন ব্যাচে আছে তা বের করি
        const myBatches = await Batch.find({ students: studentId }).select('_id');
        const batchIds = myBatches.map(b => b._id);

        // ২. সেই ব্যাচের অ্যাসাইনমেন্টগুলো খুঁজি
        const assignments = await Assignment.find({ batch: { $in: batchIds } })
            .populate('batch', 'name')
            .sort({ dueDate: 1 }); // যেটার ডেট আগে সেটা আগে দেখাবে

        // ৩. ছাত্র ইতিমধ্যে কোনগুলো সাবমিট করেছে তা বের করি
        const mySubmissions = await Submission.find({ student: studentId });
        
        // ৪. অ্যাসাইনমেন্টের সাথে স্ট্যাটাস (Submitted/Pending) জুড়ে দিই
        const result = assignments.map(assign => {
            const submission = mySubmissions.find(sub => sub.assignment.equals(assign._id));
            return {
                ...assign._doc,
                isSubmitted: !!submission, // true if submitted
                submissionData: submission || null
            };
        });

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit Assignment
// @route   POST /api/assignments/submit
const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, link, remarks } = req.body;
        const studentId = req.user._id;

        // চেক করি আগে সাবমিট করেছে কিনা
        const existingSub = await Submission.findOne({ assignment: assignmentId, student: studentId });
        if(existingSub) {
            return res.status(400).json({ message: 'Already submitted!' });
        }

        const submission = await Submission.create({
            assignment: assignmentId,
            student: studentId,
            submissionLink: link,
            remarks
        });

        res.status(201).json({ message: 'Assignment Submitted Successfully!', submission });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// (Optional) টেস্ট করার জন্য একটা অ্যাসাইনমেন্ট ক্রিয়েট করার ফাংশন
const createAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.create(req.body);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getStudentAssignments, submitAssignment, createAssignment };