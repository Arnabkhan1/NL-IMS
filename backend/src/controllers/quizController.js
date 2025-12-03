const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Batch = require('../models/Batch');

// @desc    Get Available Quizzes for Student
// @route   GET /api/quizzes/student
const getStudentQuizzes = async (req, res) => {
    try {
        const studentId = req.user._id;

        // ১. ছাত্রের ব্যাচ খুঁজে বের করা
        const myBatches = await Batch.find({ students: studentId }).select('_id');
        const batchIds = myBatches.map(b => b._id);

        // ২. সেই ব্যাচের কুইজগুলো আনা
        const quizzes = await Quiz.find({ batch: { $in: batchIds } });

        // ৩. ছাত্র কোনগুলো দিয়েছে তা চেক করা
        const myResults = await QuizResult.find({ student: studentId });

        const data = quizzes.map(q => {
            const result = myResults.find(r => r.quiz.equals(q._id));
            return {
                ...q._doc,
                isTaken: !!result, // true if already exam given
                score: result ? result.score : null,
                total: result ? result.totalMarks : null
            };
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Single Quiz Details (To take exam)
// @route   GET /api/quizzes/:id
const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer'); // উত্তর ফ্রন্টএন্ডে পাঠাবো না (চিটিং ঠেকাতে)
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit Quiz & Calculate Result
// @route   POST /api/quizzes/submit
const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body; // answers = [0, 2, 1...] (User selected indexes)
        const studentId = req.user._id;

        // ১. কুইজ এবং আসল উত্তরগুলো আনি
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        // ২. আগে দিয়েছে কিনা চেক করি
        const existingResult = await QuizResult.findOne({ quiz: quizId, student: studentId });
        if (existingResult) return res.status(400).json({ message: 'You have already taken this quiz!' });

        // ৩. স্কোর ক্যালকুলেশন
        let score = 0;
        let correct = 0;
        let wrong = 0;

        quiz.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                score++;
                correct++;
            } else {
                wrong++;
            }
        });

        // ৪. রেজাল্ট সেভ করি
        const result = await QuizResult.create({
            student: studentId,
            quiz: quizId,
            score,
            totalMarks: quiz.questions.length,
            correctAnswers: correct,
            wrongAnswers: wrong
        });

        res.json({ message: 'Quiz Submitted!', result });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Quiz (Testing Purpose / Admin)
const createQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudentQuizzes, getQuizById, submitQuiz, createQuiz };