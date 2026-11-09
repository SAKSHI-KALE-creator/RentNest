const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters']
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: [
        'Apartment / Flat',
        'Independent House / Villa',
        'Builder Floor',
        'Studio / 1 RK',
        'Penthouse',
        'PG / Co-Living'
      ]
    },
    bhk: {
      type: String,
      required: [true, 'BHK configuration is required'],
      enum: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK']
    },
    rentAmount: {
      type: Number,
      required: [true, 'Monthly rent amount is required in INR (₹)'],
      min: [1000, 'Rent must be at least ₹1,000']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required in INR (₹)'],
      default: 0
    },
    maintenanceCharges: {
      type: Number,
      default: 0
    },
    carpetArea: {
      type: Number,
      required: [true, 'Carpet area in sq ft is required'],
      min: [50, 'Carpet area must be at least 50 sq ft']
    },
    furnishing: {
      type: String,
      required: [true, 'Furnishing status is required'],
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Semi-Furnished'
    },
    preferredTenants: {
      type: String,
      enum: ['Anyone', 'Family Only', 'Bachelors / Professionals', 'Company Lease'],
      default: 'Anyone'
    },
    address: {
      locality: {
        type: String,
        required: [true, 'Locality/Area name is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian PIN code']
      },
      landmark: {
        type: String,
        trim: true
      }
    },
    amenities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
      ]
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    floorNumber: {
      type: Number,
      default: 2
    },
    totalFloors: {
      type: Number,
      default: 5
    },
    facing: {
      type: String,
      enum: ['East', 'North', 'North-East', 'West', 'South', 'North-West', 'South-East', 'South-West'],
      default: 'East'
    },
    bathrooms: {
      type: Number,
      default: 2
    },
    balconies: {
      type: Number,
      default: 1
    },
    parking: {
      type: String,
      enum: ['Covered 4-Wheeler', 'Open 4-Wheeler', '2-Wheeler Only', 'None', 'Covered 4 & 2-Wheeler'],
      default: 'Covered 4 & 2-Wheeler'
    },
    availableFrom: {
      type: Date,
      default: Date.now
    },
    featured: {
      type: Boolean,
      default: false
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    reviewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast Indian search queries
propertySchema.index({ 'address.city': 1, status: 1, rentAmount: 1 });
propertySchema.index({ propertyType: 1, bhk: 1 });
propertySchema.index({ title: 'text', description: 'text', 'address.locality': 'text', 'address.city': 'text' });

module.exports = mongoose.model('Property', propertySchema);
