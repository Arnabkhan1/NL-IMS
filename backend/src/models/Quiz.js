const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    title: { type: String, required: true }, // e.g., "React Basic Test"
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }], // ["Option A", "Option B", ...]
            correctAnswer: { type: Number, required: true } // 0, 1, 2, or 3 (Index of correct option)
        }
    ],
    duration: { type: Number, default: 30 } // In minutes
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);