const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Teacher/Coordinator
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);