const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required (1-5)'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: 1000
    },
    pros: {
      type: String,
      default: ''
    },
    cons: {
      type: String,
      default: ''
    },
    localityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  },
  {
    timestamps: true
  }
);

// Prevent user from submitting multiple reviews on the same property
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
