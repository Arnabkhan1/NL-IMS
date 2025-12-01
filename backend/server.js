// backend/server.js
require('dotenv').config(); // .env ফাইল লোড করা
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// প্রথমে ডাটাবেস কানেক্ট হবে, তারপর সার্ভার রান হবে
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});