const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookingType: {
      type: String,
      enum: ['Schedule Visit', 'Rental Application'],
      default: 'Schedule Visit'
    },
    visitDate: {
      type: Date,
      required: true
    },
    visitTimeSlot: {
      type: String,
      enum: [
        '09:00 AM - 11:00 AM',
        '11:00 AM - 01:00 PM',
        '02:00 PM - 04:00 PM',
        '04:00 PM - 06:00 PM',
        '06:00 PM - 08:00 PM'
      ],
      default: '11:00 AM - 01:00 PM'
    },
    proposedMoveInDate: {
      type: Date
    },
    proposedRent: {
      type: Number
    },
    contactPhone: {
      type: String,
      required: true
    },
    alternatePhone: {
      type: String
    },
    message: {
      type: String,
      maxlength: 1000,
      default: 'Interested in visiting and renting this property.'
    },
    employmentType: {
      type: String,
      enum: ['IT / Corporate Professional', 'Salaried Employee', 'Business Owner / Entrepreneur', 'Student', 'Freelancer / Consultant', 'Other'],
      default: 'IT / Corporate Professional'
    },
    familyMembersCount: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
      default: 'pending'
    },
    adminNotes: {
      type: String
    },
    ownerResponse: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ property: 1, user: 1 });
bookingSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
