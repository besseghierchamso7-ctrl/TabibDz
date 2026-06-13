const express = require('express');
const { createReview, listReviews, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('patient'), createReview);
router.get('/', listReviews);
router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;
