const express = require('express');
const router = express.Router();
const { addReview, getPropertyReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:propertyId', getPropertyReviews);
router.post('/:propertyId', protect, addReview);

module.exports = router;
