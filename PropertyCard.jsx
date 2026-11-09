import React from 'react';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/formatters';

const PropertyCard = ({ property }) => {
  const {
    _id,
    title,
    propertyType,
    bhk,
    rentAmount,
    securityDeposit,
    carpetArea,
    furnishing,
    address,
    images,
    owner,
    featured,
    averageRating,
    viewsCount,
    bathrooms
  } = property;

  const displayImage =
    images && images.length > 0
      ? images[0]
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="card rent-card h-100 border-0">
      {/* Image Container with Badges */}
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <img
          src={displayImage}
          alt={title}
          className="w-100 h-100 object-fit-cover transition-transform"
          style={{ transition: 'transform 0.4s ease' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="position-absolute top-0 start-0 p-3 d-flex flex-wrap gap-2">
          <span className="badge bg-dark bg-opacity-75 text-white backdrop-blur shadow-sm fw-semibold">
            <i className="bi bi-geo-alt-fill text-warning me-1"></i>
            {address?.city || 'India'}
          </span>
          {featured && (
            <span className="badge bg-warning text-dark fw-bold shadow-sm">
              <i className="bi bi-star-fill me-1"></i> Featured
            </span>
          )}
        </div>

        {/* Top Right BHK Tag */}
        <div className="position-absolute top-0 end-0 p-3">
          <span className="badge bg-white text-dark shadow-sm fw-bold px-2 py-1 border">
            {bhk}
          </span>
        </div>

        {/* Bottom Bar on Image: Price & Rating */}
        <div
          className="position-absolute bottom-0 start-0 end-0 p-3 text-white d-flex justify-content-between align-items-end"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
        >
          <div>
            <span className="fs-4 fw-bold">{formatINR(rentAmount)}</span>
            <small className="text-light ms-1 opacity-75">/ month</small>
          </div>
          <div className="d-flex align-items-center gap-1 bg-white bg-opacity-25 px-2 py-1 rounded-pill small">
            <i className="bi bi-star-fill text-warning"></i>
            <span className="fw-bold">{averageRating ? averageRating.toFixed(1) : '4.8'}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-3 d-flex flex-column">
        {/* Locality & Type */}
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-muted small fw-semibold text-truncate" style={{ maxWidth: '70%' }}>
            <i className="bi bi-pin-map-fill text-teal-main me-1"></i>
            {address?.locality || 'Prime Locality'}
          </span>
          <span className="badge bg-light text-secondary border small">{propertyType?.split(' ')[0]}</span>
        </div>

        {/* Title */}
        <h6 className="card-title fw-bold text-dark mb-2 text-truncate-2" style={{ minHeight: '44px', lineHeight: '1.3' }}>
          <Link to={`/properties/${_id}`} className="text-dark hover-text-teal">
            {title}
          </Link>
        </h6>

        {/* Key Features Chips */}
        <div className="row g-2 py-2 my-1 border-top border-bottom text-muted small">
          <div className="col-4 d-flex align-items-center gap-1 text-truncate">
            <i className="bi bi-arrows-angle text-teal-main"></i>
            <span>{carpetArea} sqft</span>
          </div>
          <div className="col-4 d-flex align-items-center gap-1 text-truncate">
            <i className="bi bi-house-door text-teal-main"></i>
            <span>{furnishing?.replace('-Furnished', '')}</span>
          </div>
          <div className="col-4 d-flex align-items-center gap-1 text-truncate">
            <i className="bi bi-droplet text-teal-main"></i>
            <span>{bathrooms || 2} Baths</span>
          </div>
        </div>

        {/* Deposit & Owner info */}
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
          <div>
            <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Deposit</span>
            <span className="fw-semibold text-secondary small">{formatINR(securityDeposit, true)}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              to={`/properties/${_id}`}
              className="btn btn-sm btn-outline-teal px-3 py-1 fw-semibold d-flex align-items-center gap-1 shadow-sm"
            >
              <span>Explore</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
