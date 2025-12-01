// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // একই ইমেইল দিয়ে দুইবার একাউন্ট করা যাবে না
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // ডিফল্টভাবে পাসওয়ার্ড রিটার্ন করবে না (সিকিউরিটির জন্য)
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student', 'coordinator', 'editor', 'social'],
        default: 'student' // কিছু না বললে অটোমেটিক student হবে
    },
    isActive: {
        type: Boolean,
        default: true // কাউকে ব্যান করতে চাইলে এটি false করে দেওয়া যাবে
    },
    // ফিউচারে আমরা এখানে profileId যোগ করব (যেমন: StudentProfile বা TeacherProfile)
}, {
    timestamps: true // অটোমেটিক createdAt এবং updatedAt সময় সেভ হবে
});

// 🔒 পাসওয়ার্ড এনক্রিপ্ট করার লজিক (Pre-save Hook)
// ডাটাবেসে সেভ হওয়ার ঠিক আগে এই ফাংশনটি রান হবে
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    // পাসওয়ার্ড হ্যাশ করা হচ্ছে (Salt 10)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 পাসওয়ার্ড চেক করার মেথড (লগিন করার সময় লাগবে)
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);