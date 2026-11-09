const Property = require('../models/Property');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get complete administrative dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalRenters = await User.countDocuments({ role: 'user' });

    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const rejectedProperties = await Property.countDocuments({ status: 'rejected' });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });

    // Aggregates for average rent by Indian city
    const cityDistribution = await Property.aggregate([
      { $group: { _id: '$address.city', count: { $sum: 1 }, avgRent: { $avg: '$rentAmount' } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // Recent properties pending approval
    const recentPending = await Property.find({ status: 'pending' })
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent user signups
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalOwners,
          totalRenters,
          totalProperties,
          pendingProperties,
          approvedProperties,
          rejectedProperties,
          totalBookings,
          pendingBookings,
          confirmedBookings
        },
        cityDistribution,
        recentPending,
        recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties for admin moderation
// @route   GET /api/admin/properties
// @access  Private (Admin only)
const getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const { status, city, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (city && city !== 'all') {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'address.locality': { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject property listing
// @route   PUT /api/admin/properties/:id/status
// @access  Private (Admin only)
const updatePropertyStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'pending', 'approved', or 'rejected'."
      });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after' }
    ).populate('owner', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.'
      });
    }

    res.json({
      success: true,
      message: `Property listing status set to '${status}'.`,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsersAdmin = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'owner', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified.'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: 'after' }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      message: `User role updated to '${role}'.`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own account.'
      });
    }

    await User.findByIdAndDelete(req.params.id);
    // Delete their properties as well
    await Property.deleteMany({ owner: req.params.id });

    res.json({
      success: true,
      message: 'User and all associated properties removed.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings across platform
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('property', 'title address rentAmount')
      .populate('user', 'name email phone avatar')
      .populate('owner', 'name email phone')
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

module.exports = {
  getAdminDashboardStats,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  getAllUsersAdmin,
  updateUserRole,
  deleteUserAdmin,
  getAllBookingsAdmin
};
