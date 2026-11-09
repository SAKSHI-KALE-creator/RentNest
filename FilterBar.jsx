import React, { useState } from 'react';
import {
  INDIAN_CITIES,
  PROPERTY_TYPES,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  PREFERRED_TENANTS,
  AMENITIES_LIST
} from '../utils/formatters';

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value, page: 1 });
  };

  const handleAmenityToggle = (amenity) => {
    let current = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];
    if (current.includes(amenity)) {
      current = current.filter((a) => a !== amenity);
    } else {
      current.push(amenity);
    }
    handleInputChange('amenities', current.join(','));
  };

  const selectedAmenities = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];

  return (
    <div className="bg-white rounded-3 shadow-sm border p-4 mb-4">
      {/* Primary Row: Search, City, BHK, Type */}
      <div className="row g-3">
        {/* Search Input */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label small fw-bold text-muted mb-1">
            <i className="bi bi-search me-1 text-teal-main"></i> Search Locality or Society
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-geo-alt text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="e.g. Indiranagar, Bandra, Powai..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* City Filter */}
        <div className="col-lg-3 col-md-6">
          <label className="form-label small fw-bold text-muted mb-1">
            <i className="bi bi-buildings me-1 text-teal-main"></i> Indian City
          </label>
          <select
            className="form-select"
            value={filters.city || 'All'}
            onChange={(e) => handleInputChange('city', e.target.value)}
          >
            <option value="All">All Major Cities (India)</option>
            {INDIAN_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.state})
              </option>
            ))}
          </select>
        </div>

        {/* BHK Filter */}
        <div className="col-lg-2 col-md-6">
          <label className="form-label small fw-bold text-muted mb-1">
            <i className="bi bi-door-open me-1 text-teal-main"></i> BHK Type
          </label>
          <select
            className="form-select"
            value={filters.bhk || 'All'}
            onChange={(e) => handleInputChange('bhk', e.target.value)}
          >
            <option value="All">All BHKs</option>
            {BHK_OPTIONS.map((bhk) => (
              <option key={bhk} value={bhk}>
                {bhk}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div className="col-lg-3 col-md-6">
          <label className="form-label small fw-bold text-muted mb-1">
            <i className="bi bi-house me-1 text-teal-main"></i> Property Type
          </label>
          <select
            className="form-select"
            value={filters.propertyType || 'All'}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
          >
            <option value="All">All Property Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters Expandable Section */}
      {showAdvanced && (
        <div className="pt-3 mt-3 border-top">
          <div className="row g-3">
            {/* Price Range */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-muted mb-1">Min Rent (₹/mo)</label>
              <select
                className="form-select"
                value={filters.minRent || ''}
                onChange={(e) => handleInputChange('minRent', e.target.value)}
              >
                <option value="">No Minimum</option>
                <option value="10000">₹10,000</option>
                <option value="20000">₹20,000</option>
                <option value="35000">₹35,000</option>
                <option value="50000">₹50,000</option>
                <option value="75000">₹75,000</option>
                <option value="100000">₹1,00,000</option>
              </select>
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-muted mb-1">Max Rent (₹/mo)</label>
              <select
                className="form-select"
                value={filters.maxRent || ''}
                onChange={(e) => handleInputChange('maxRent', e.target.value)}
              >
                <option value="">No Maximum</option>
                <option value="25000">₹25,000</option>
                <option value="50000">₹50,000</option>
                <option value="75000">₹75,000</option>
                <option value="100000">₹1,00,000</option>
                <option value="150000">₹1,50,000</option>
                <option value="250000">₹2,50,000+</option>
              </select>
            </div>

            {/* Furnishing Status */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-muted mb-1">Furnishing</label>
              <select
                className="form-select"
                value={filters.furnishing || 'All'}
                onChange={(e) => handleInputChange('furnishing', e.target.value)}
              >
                <option value="All">Any Furnishing</option>
                {FURNISHING_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Tenants */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-muted mb-1">Preferred Tenants</label>
              <select
                className="form-select"
                value={filters.preferredTenants || 'All'}
                onChange={(e) => handleInputChange('preferredTenants', e.target.value)}
              >
                <option value="All">Any Tenant</option>
                {PREFERRED_TENANTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Amenities Chips */}
            <div className="col-12 mt-3">
              <label className="form-label small fw-bold text-muted mb-2">Popular Amenities</label>
              <div className="d-flex flex-wrap gap-2">
                {AMENITIES_LIST.slice(0, 10).map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      className={`btn btn-sm ${
                        isSelected
                          ? 'btn-teal'
                          : 'btn-outline-secondary bg-light text-dark border-0'
                      } rounded-pill py-1 px-3`}
                      onClick={() => handleAmenityToggle(amenity)}
                    >
                      {isSelected && <i className="bi bi-check2 me-1"></i>}
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Control Buttons Bar */}
      <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
        <button
          type="button"
          className="btn btn-link text-teal-main fw-semibold p-0 text-decoration-none small d-flex align-items-center gap-1"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <i className={`bi ${showAdvanced ? 'bi-chevron-up' : 'bi-sliders'}`}></i>
          <span>{showAdvanced ? 'Hide Advanced Filters' : 'More Filters (Rent, Amenities, Furnishing)'}</span>
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1"
          onClick={onReset}
        >
          <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
