// backend/src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { createPayment, getPayments } = require('../controllers/paymentController');

// সব রাউট এডমিনের জন্য
router.use(protect);
router.use(authorize('admin'));

router.post('/', createPayment);
router.get('/', getPayments);

module.exports = router;