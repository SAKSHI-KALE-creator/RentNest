import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  INDIAN_CITIES,
  PROPERTY_TYPES,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  PREFERRED_TENANTS,
  AMENITIES_LIST
} from '../utils/formatters';

const PostPropertyPage = () => {
  const { id } = useParams(); // If present, edit mode
  const navigate = useNavigate();
  const { user, isAdmin, isOwner } = useAuth();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment / Flat',
    bhk: '2 BHK',
    rentAmount: 35000,
    securityDeposit: 100000,
    maintenanceCharges: 3000,
    carpetArea: 1100,
    furnishing: 'Semi-Furnished',
    preferredTenants: 'Anyone',
    address: {
      locality: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      landmark: ''
    },
    amenities: [
      '24/7 Security & CCTV',
      '100% Power Backup',
      'Covered Car Parking',
      'Elevator / Lift',
      'Modular Kitchen'
    ],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    floorNumber: 3,
    totalFloors: 10,
    facing: 'East',
    bathrooms: 2,
    balconies: 1,
    parking: 'Covered 4 & 2-Wheeler'
  });

  const [imageInput, setImageInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const res = await api.get(`/properties/${id}`);
          if (res.data.success) {
            setFormData(res.data.data);
          }
        } catch (err) {
          setError('Failed to fetch property details.');
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      const updated = exists
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Basic pincode validation
    if (!/^[1-9][0-9]{5}$/.test(formData.address.pincode)) {
      setError('Please enter a valid 6-digit Indian PIN code (e.g. 560038).');
      setSubmitting(false);
      return;
    }

    try {
      if (isEditMode) {
        const res = await api.put(`/properties/${id}`, formData);
        if (res.data.success) {
          setSuccess('Property listing updated successfully!');
          setTimeout(() => navigate('/owner/dashboard'), 1500);
        }
      } else {
        const res = await api.post('/properties', formData);
        if (res.data.success) {
          setSuccess(res.data.message);
          setTimeout(() => {
            if (isAdmin) {
              navigate('/admin/dashboard');
            } else {
              navigate('/owner/dashboard');
            }
          }, 1500);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save property listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <Link to="/owner/dashboard" className="text-decoration-none text-muted small">
                  <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
                </Link>
                <h3 className="fw-bold text-dark mt-1">
                  {isEditMode ? 'Edit Property Listing' : 'Post Free Rental Property Listing'}
                </h3>
                <p className="text-muted small mb-0">
                  Fill in your property specs to reach thousands of verified tenants across India.
                </p>
              </div>
              <span className="badge bg-success bg-opacity-10 text-success p-2">
                <i className="bi bi-tag-fill me-1"></i> Zero Listing Fee
              </span>
            </div>

            {error && <div className="alert alert-danger shadow-sm">{error}</div>}
            {success && <div className="alert alert-success shadow-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
              {/* Section 1: Basic Information */}
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">1. Basic Property Details</h5>
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <label className="form-label small fw-bold">Listing Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Spacious 3 BHK Gated Flat in Indiranagar near Metro"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Property Type <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">BHK Configuration <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={formData.bhk}
                    onChange={(e) => handleInputChange('bhk', e.target.value)}
                  >
                    {BHK_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold">Detailed Description <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Describe the house features, ventilation, nearby IT parks/schools, water source (Cauvery/Borewell), power backup, etc."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Section 2: Location Details */}
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">2. Indian Location & Address</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Locality / Area <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Indiranagar 100 Feet Road, Bandra West, Powai"
                    value={formData.address.locality}
                    onChange={(e) => handleAddressChange('locality', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">City <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={formData.address.city}
                    onChange={(e) => {
                      const selected = INDIAN_CITIES.find((c) => c.name === e.target.value);
                      handleAddressChange('city', e.target.value);
                      if (selected) handleAddressChange('state', selected.state);
                    }}
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>{c.name} ({c.state})</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold">State</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold">Pincode (6 digits) <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="560038"
                    maxLength="6"
                    value={formData.address.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold">Landmark</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Near Metro Station / D-Mart"
                    value={formData.address.landmark}
                    onChange={(e) => handleAddressChange('landmark', e.target.value)}
                  />
                </div>
              </div>

              {/* Section 3: Financials */}
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">3. Rental Financials (INR)</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Monthly Rent (₹) <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.rentAmount}
                      onChange={(e) => handleInputChange('rentAmount', Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold">Security Deposit (₹)</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange('securityDeposit', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold">Monthly Maintenance (₹)</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.maintenanceCharges}
                      onChange={(e) => handleInputChange('maintenanceCharges', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Specifications */}
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">4. Property Specifications</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <label className="form-label small fw-bold">Carpet Area (sq ft) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.carpetArea}
                    onChange={(e) => handleInputChange('carpetArea', Number(e.target.value))}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Furnishing Status</label>
                  <select
                    className="form-select"
                    value={formData.furnishing}
                    onChange={(e) => handleInputChange('furnishing', e.target.value)}
                  >
                    {FURNISHING_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Preferred Tenants</label>
                  <select
                    className="form-select"
                    value={formData.preferredTenants}
                    onChange={(e) => handleInputChange('preferredTenants', e.target.value)}
                  >
                    {PREFERRED_TENANTS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Vastu / Facing</label>
                  <select
                    className="form-select"
                    value={formData.facing}
                    onChange={(e) => handleInputChange('facing', e.target.value)}
                  >
                    {['East', 'North', 'North-East', 'West', 'South'].map((fac) => (
                      <option key={fac} value={fac}>{fac}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Floor Number</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.floorNumber}
                    onChange={(e) => handleInputChange('floorNumber', Number(e.target.value))}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Total Floors</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.totalFloors}
                    onChange={(e) => handleInputChange('totalFloors', Number(e.target.value))}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Bathrooms</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Balconies</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.balconies}
                    onChange={(e) => handleInputChange('balconies', Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Section 5: Amenities */}
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">5. Amenities & Features</h5>
              <div className="row g-2 mb-4">
                {AMENITIES_LIST.map((amenity) => {
                  const checked = formData.amenities.includes(amenity);
                  return (
                    <div key={amenity} className="col-md-4 col-sm-6">
                      <div
                        className={`p-2 rounded border cursor-pointer d-flex align-items-center gap-2 ${
                          checked ? 'bg-light border-success text-dark fw-semibold' : 'text-muted'
                        }`}
                        onClick={() => handleAmenityToggle(amenity)}
                        style={{ cursor: 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={checked}
                          onChange={() => {}}
                        />
                        <span className="small">{amenity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section 6: Photos */}
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">6. Property Photos</h5>
              <div className="mb-4">
                <div className="input-group mb-2">
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Paste Image URL (https://...)"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleAddImage}
                  >
                    Add Photo URL
                  </button>
                </div>
                <small className="text-muted d-block mb-3">
                  Curated sample photos are pre-loaded. You can add more URLs or remove them as needed.
                </small>

                <div className="d-flex flex-wrap gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="position-relative border rounded-3 overflow-hidden shadow-sm" style={{ width: '120px', height: '85px' }}>
                      <img src={img} alt="Property" className="w-100 h-100 object-fit-cover" />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 p-1 rounded-0"
                        style={{ fontSize: '0.65rem' }}
                        onClick={() => handleRemoveImage(i)}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-light border px-4"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-teal px-5 py-2 fw-bold shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting Property...' : (isEditMode ? 'Update Listing' : 'Publish Property Listing')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPropertyPage;
