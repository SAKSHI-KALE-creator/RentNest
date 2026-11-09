const Property = require('../models/Property');
const Review = require('../models/Review');

// @desc    Get all properties with advanced Indian real estate filters & pagination
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const {
      search,
      city,
      locality,
      propertyType,
      bhk,
      minRent,
      maxRent,
      furnishing,
      preferredTenants,
      amenities,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { status: 'approved', isAvailable: true };

    // Search keyword across title, description, locality, city
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.locality': { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }

    // City filter
    if (city && city !== 'All') {
      query['address.city'] = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    // Locality filter
    if (locality) {
      query['address.locality'] = { $regex: locality, $options: 'i' };
    }

    // Property Type filter
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // BHK Configuration filter
    if (bhk && bhk !== 'All') {
      query.bhk = bhk;
    }

    // Rent Range (INR)
    if (minRent || maxRent) {
      query.rentAmount = {};
      if (minRent) query.rentAmount.$gte = Number(minRent);
      if (maxRent) query.rentAmount.$lte = Number(maxRent);
    }

    // Furnishing status
    if (furnishing && furnishing !== 'All') {
      query.furnishing = furnishing;
    }

    // Preferred Tenants
    if (preferredTenants && preferredTenants !== 'All') {
      query.preferredTenants = preferredTenants;
    }

    // Amenities filter
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      query.amenities = { $all: amenitiesList };
    }

    // Sorting options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOptions = { rentAmount: 1 };
    else if (sort === 'price_desc') sortOptions = { rentAmount: -1 };
    else if (sort === 'rating') sortOptions = { averageRating: -1 };
    else if (sort === 'area') sortOptions = { carpetArea: -1 };
    else if (sort === 'popular') sortOptions = { viewsCount: -1 };

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      count: properties.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties for homepage showcase
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res, next) => {
  try {
    const featured = await Property.find({ status: 'approved', isAvailable: true })
      .populate('owner', 'name email phone avatar')
      .sort({ averageRating: -1, viewsCount: -1 })
      .limit(6);

    res.json({
      success: true,
      count: featured.length,
      data: featured
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Indian city counts and highlights
// @route   GET /api/properties/cities-summary
// @access  Public
const getCitiesSummary = async (req, res, next) => {
  try {
    const cityAgg = await Property.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$address.city', count: { $sum: 1 }, avgRent: { $avg: '$rentAmount' } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: cityAgg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property details by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone avatar bio role city'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.'
      });
    }

    // Increment views asynchronously
    property.viewsCount += 1;
    await property.save();

    // Get verified reviews for this property
    const reviews = await Review.find({ property: property._id })
      .populate('user', 'name avatar city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...property.toObject(),
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Owner, Admin)
const createProperty = async (req, res, next) => {
  try {
    // If admin is creating, it can be auto-approved; otherwise pending
    const status = req.user.role === 'admin' ? 'approved' : 'pending';

    const propertyData = {
      ...req.body,
      owner: req.user._id,
      status
    };

    // Ensure images array is not empty
    if (!propertyData.images || propertyData.images.length === 0) {
      propertyData.images = [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
      ];
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message:
        req.user.role === 'admin'
          ? 'Property listing created and published!'
          : 'Property listing submitted successfully! Pending admin approval.',
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner of the property or Admin)
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.'
      });
    }

    // Make sure logged in user is property owner or admin
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this property listing.'
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Property updated successfully!',
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner of the property or Admin)
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.'
      });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this property listing.'
      });
    }

    await Property.findByIdAndDelete(req.params.id);
    // Also clean up reviews & bookings
    await Review.deleteMany({ property: req.params.id });

    res.json({
      success: true,
      message: 'Property listing deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current owner's properties
// @route   GET /api/properties/my-listings
// @access  Private (Owner or Admin)
const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getFeaturedProperties,
  getCitiesSummary,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties
};
