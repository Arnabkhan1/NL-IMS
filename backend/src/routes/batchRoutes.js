// backend/src/routes/batchRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { createBatch, getBatches, enrollStudent } = require('../controllers/batchController');

// সব রাউট প্রোটেক্টড এবং শুধু এডমিন এক্সেস করতে পারবে
router.use(protect);
router.use(authorize('admin'));

router.post('/', createBatch);
router.get('/', getBatches);
router.post('/:id/enroll', enrollStudent); // ছাত্র ভর্তি করানোর রাউট

module.exports = router;