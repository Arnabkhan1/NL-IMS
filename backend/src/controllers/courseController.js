// backend/src/controllers/courseController.js
const Course = require('../models/Course');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin only)
const createCourse = async (req, res) => {
    try {
        const { title, courseCode, description, price, duration, thumbnail } = req.body;

        // চেক করি কোর্স কোডটি ইউনিক কিনা
        const courseExists = await Course.findOne({ courseCode });
        if (courseExists) {
            return res.status(400).json({ message: 'Course code already exists' });
        }

        const course = await Course.create({
            title,
            courseCode,
            description,
            price,
            duration,
            thumbnail
        });

        res.status(201).json(course);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public (সবাই দেখতে পাবে)
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses
};