const express = require('express');
const router = express.Router();
const {
  getProperties,
  getFeaturedProperties,
  getCitiesSummary,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/cities-summary', getCitiesSummary);

// Private routes for authenticated users/owners
router.get('/my/listings', protect, authorize('owner', 'admin'), getMyProperties);
router.post('/', protect, authorize('owner', 'admin'), createProperty);

// Single property operations
router.get('/:id', getPropertyById);
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;
