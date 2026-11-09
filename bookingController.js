const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a visit schedule or rental application
// @route   POST /api/bookings
// @access  Private (User, Owner, Admin)
const createBooking = async (req, res, next) => {
  try {
    const {
      propertyId,
      bookingType,
      visitDate,
      visitTimeSlot,
      proposedMoveInDate,
      proposedRent,
      contactPhone,
      alternatePhone,
      message,
      employmentType,
      familyMembersCount
    } = req.body;

    if (!propertyId || !visitDate || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID, preferred visit date, and contact phone number.'
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.'
      });
    }

    // Disallow owners booking their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book or apply for your own property listing.'
      });
    }

    const booking = await Booking.create({
      property: property._id,
      user: req.user._id,
      owner: property.owner,
      bookingType: bookingType || 'Schedule Visit',
      visitDate,
      visitTimeSlot: visitTimeSlot || '11:00 AM - 01:00 PM',
      proposedMoveInDate,
      proposedRent: proposedRent || property.rentAmount,
      contactPhone,
      alternatePhone,
      message,
      employmentType,
      familyMembersCount,
      status: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title address rentAmount bhk images')
      .populate('owner', 'name email phone avatar');

    res.status(201).json({
      success: true,
      message: `${bookingType || 'Visit'} request submitted successfully! Landlord will review your request.`,
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings & applications
// @route   GET /api/bookings/my-bookings
// @access  Private
const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'title address rentAmount bhk images propertyType')
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's received booking requests & visit inquiries
// @route   GET /api/bookings/owner-requests
// @access  Private (Owner, Admin)
const getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property', 'title address rentAmount bhk images')
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Accept / Reject / Confirm)
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner, Admin)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, ownerResponse } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found.'
      });
    }

    // Verify authorization: must be owner or admin
    if (
      booking.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this booking request.'
      });
    }

    if (status) booking.status = status;
    if (ownerResponse) booking.ownerResponse = ownerResponse;

    await booking.save();

    res.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking request
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found.'
      });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking request.'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking request cancelled successfully.',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking
};
