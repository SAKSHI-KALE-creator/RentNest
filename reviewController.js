const Review = require('../models/Review');
const Property = require('../models/Property');

// @desc    Add a review for a property
// @route   POST /api/reviews/:propertyId
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment, pros, cons, localityRating } = req.body;
    const propertyId = req.params.propertyId;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      property: propertyId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this property.'
      });
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      rating: Number(rating),
      comment,
      pros: pros || '',
      cons: cons || '',
      localityRating: Number(localityRating) || 5
    });

    // Update Property average rating & reviewsCount
    const allReviews = await Review.find({ property: propertyId });
    const avg =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    property.averageRating = parseFloat(avg.toFixed(1));
    property.reviewsCount = allReviews.length;
    await property.save();

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name avatar city'
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a property
// @route   GET /api/reviews/:propertyId
// @access  Public
const getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name avatar city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getPropertyReviews
};
