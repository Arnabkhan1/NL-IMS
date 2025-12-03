const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submissionLink: { type: String, required: true }, // Drive Link or Github Link
    remarks: { type: String }, // Optional comment by student
    grade: { type: Number }, // Teacher will give marks later
    feedback: { type: String } // Teacher will give feedback later
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);