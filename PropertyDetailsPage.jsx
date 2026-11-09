import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatINR, formatDate } from '../utils/formatters';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Booking form state
  const [bookingType, setBookingType] = useState('Schedule Visit');
  const [visitDate, setVisitDate] = useState('');
  const [visitTimeSlot, setVisitTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 ');
  const [message, setMessage] = useState('');
  const [proposedRent, setProposedRent] = useState('');
  const [employmentType, setEmploymentType] = useState('IT / Corporate Professional');
  const [familyMembersCount, setFamilyMembersCount] = useState(2);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // Review form state
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPros, setReviewPros] = useState('');
  const [reviewCons, setReviewCons] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        if (res.data.success) {
          setProperty(res.data.data);
          setProposedRent(res.data.data.rentAmount);
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }

    setBookingSubmitting(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const payload = {
        propertyId: id,
        bookingType,
        visitDate,
        visitTimeSlot,
        contactPhone,
        message,
        proposedRent: Number(proposedRent) || property.rentAmount,
        employmentType,
        familyMembersCount: Number(familyMembersCount)
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        setBookingSuccess(res.data.message);
        setMessage('');
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to submit visit request. Please try again.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }

    setReviewSubmitting(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const payload = {
        rating,
        comment: reviewComment,
        pros: reviewPros,
        cons: reviewCons
      };

      const res = await api.post(`/reviews/${id}`, payload);
      if (res.data.success) {
        setReviewSuccess('Thank you! Your verified review has been published.');
        // Append review to list
        setProperty((prev) => ({
          ...prev,
          reviews: [res.data.data, ...(prev.reviews || [])],
          reviewsCount: (prev.reviewsCount || 0) + 1
        }));
        setReviewComment('');
        setReviewPros('');
        setReviewCons('');
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-teal-main my-5" role="status">
          <span className="visually-hidden">Loading property...</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-5 text-center">
        <div className="bg-white p-5 rounded-4 border shadow-sm my-4">
          <i className="bi bi-exclamation-triangle-fill text-warning fs-1 mb-3"></i>
          <h3>Property Not Found</h3>
          <p className="text-muted">The listing you are looking for may have been rented or removed.</p>
          <Link to="/properties" className="btn btn-teal mt-2">
            Browse Other Rental Homes
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    propertyType,
    bhk,
    rentAmount,
    securityDeposit,
    maintenanceCharges,
    carpetArea,
    furnishing,
    preferredTenants,
    address,
    amenities,
    images,
    owner,
    floorNumber,
    totalFloors,
    facing,
    bathrooms,
    balconies,
    parking,
    availableFrom,
    averageRating,
    reviewsCount,
    viewsCount,
    reviews = []
  } = property;

  return (
    <div className="py-4">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/properties" className="text-decoration-none text-muted">Properties</Link></li>
            <li className="breadcrumb-item"><Link to={`/properties?city=${encodeURIComponent(address?.city)}`} className="text-decoration-none text-muted">{address?.city}</Link></li>
            <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '300px' }}>{title}</li>
          </ol>
        </nav>

        {/* Title & Key Highlights Header */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="badge badge-bhk">{bhk}</span>
              <span className="badge bg-light text-secondary border">{propertyType}</span>
              <span className="badge badge-verified">
                <i className="bi bi-patch-check-fill me-1 text-primary"></i> Verified Listing
              </span>
              <span className="text-muted small">
                <i className="bi bi-eye me-1"></i> {viewsCount} views
              </span>
            </div>
            <h2 className="fw-bold text-dark mb-1">{title}</h2>
            <p className="text-muted mb-0">
              <i className="bi bi-geo-alt-fill text-teal-main me-1"></i>
              {address?.locality}, {address?.city}, {address?.state} - {address?.pincode}
              {address?.landmark && <span className="ms-2">({address?.landmark})</span>}
            </p>
          </div>

          {/* Pricing Header Card */}
          <div className="bg-white p-3 rounded-3 border shadow-sm text-lg-end">
            <div className="text-muted small">Monthly Rent</div>
            <div className="fs-3 fw-extrabold text-teal-main">{formatINR(rentAmount)} <span className="fs-6 text-muted fw-normal">/ mo</span></div>
            <small className="text-muted d-block">
              Deposit: <strong>{formatINR(securityDeposit)}</strong> • Maint: <strong>{formatINR(maintenanceCharges)}</strong>
            </small>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="row g-3 mb-4">
          <div className="col-lg-8">
            <div className="position-relative rounded-4 overflow-hidden shadow-sm" style={{ height: '420px', background: '#000' }}>
              <img
                src={images[selectedImage] || images[0]}
                alt={title}
                className="w-100 h-100 object-fit-cover"
              />
              <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-50 text-white d-flex justify-content-between align-items-center">
                <span>Photo {selectedImage + 1} of {images.length}</span>
                <span className="badge bg-light text-dark fw-bold">
                  <i className="bi bi-images me-1 text-teal-main"></i> Verified Property Photos
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="d-flex gap-2 mt-2 overflow-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`btn p-0 border rounded-3 overflow-hidden ${selectedImage === idx ? 'border-primary border-3' : 'opacity-75'}`}
                    style={{ width: '90px', height: '65px', flexShrink: 0 }}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt="Thumbnail" className="w-100 h-100 object-fit-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Facts Quick Card */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 border shadow-sm h-100 d-flex flex-column justify-content-between">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Property Overview</h5>
              <div className="row g-3">
                <div className="col-6">
                  <span className="text-muted small d-block">Carpet Area</span>
                  <span className="fw-bold text-dark fs-6">{carpetArea} sq ft</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Furnishing</span>
                  <span className="fw-bold text-dark fs-6">{furnishing}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Floor</span>
                  <span className="fw-bold text-dark fs-6">{floorNumber} of {totalFloors} Floors</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Facing Direction</span>
                  <span className="fw-bold text-dark fs-6">{facing} Facing</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Bathrooms</span>
                  <span className="fw-bold text-dark fs-6">{bathrooms || 2} Bathrooms</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Balconies</span>
                  <span className="fw-bold text-dark fs-6">{balconies || 1} Balcony</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Parking</span>
                  <span className="fw-bold text-dark fs-6">{parking}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Preferred Tenants</span>
                  <span className="fw-bold text-dark fs-6">{preferredTenants}</span>
                </div>
                <div className="col-12">
                  <span className="text-muted small d-block">Available From</span>
                  <span className="fw-bold text-teal-main fs-6">{formatDate(availableFrom)}</span>
                </div>
              </div>

              {/* Landlord Card Info */}
              <div className="mt-4 pt-3 border-top d-flex align-items-center gap-3">
                <img
                  src={owner?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'}
                  alt={owner?.name}
                  className="rounded-circle object-fit-cover shadow-sm"
                  style={{ width: '48px', height: '48px' }}
                />
                <div>
                  <span className="text-muted small d-block">Listed By Landlord</span>
                  <span className="fw-bold text-dark">{owner?.name || 'Verified Owner'}</span>
                  <div className="d-flex align-items-center gap-1 text-success small">
                    <i className="bi bi-shield-fill-check"></i> Identity Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Details & Booking Form Row */}
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Description Card */}
            <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
              <h5 className="fw-bold text-dark mb-3">About This Rental Property</h5>
              <p className="text-secondary leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                {description}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
              <h5 className="fw-bold text-dark mb-3">Society & Flat Amenities</h5>
              <div className="row g-3">
                {amenities && amenities.length > 0 ? (
                  amenities.map((item, idx) => (
                    <div key={idx} className="col-md-6 d-flex align-items-center gap-2 text-secondary">
                      <div className="bg-teal-main bg-opacity-10 text-teal-main rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                        <i className="bi bi-check2 fw-bold"></i>
                      </div>
                      <span className="fw-medium">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Standard gated amenities included.</p>
                )}
              </div>
            </div>

            {/* Reviews & Ratings Section */}
            <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="fw-bold text-dark mb-0">Tenant Reviews & Ratings</h5>
                  <small className="text-muted">Verified feedback from prospective and former tenants</small>
                </div>
                <div className="d-flex align-items-center gap-2 bg-light px-3 py-1 rounded-pill">
                  <i className="bi bi-star-fill text-warning fs-5"></i>
                  <span className="fw-bold fs-5 text-dark">{averageRating ? averageRating.toFixed(1) : '4.8'}</span>
                  <span className="text-muted small">({reviewsCount || reviews.length} reviews)</span>
                </div>
              </div>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="d-flex flex-column gap-3 mb-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={r.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                            alt={r.user?.name}
                            className="rounded-circle"
                            style={{ width: '32px', height: '32px' }}
                          />
                          <div>
                            <span className="fw-bold text-dark small">{r.user?.name || 'Verified Renter'}</span>
                            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>{r.user?.city}</span>
                          </div>
                        </div>
                        <div className="text-warning small">
                          {[...Array(5)].map((_, starIdx) => (
                            <i key={starIdx} className={`bi ${starIdx < r.rating ? 'bi-star-fill' : 'bi-star'} me-1`}></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-secondary small mb-2">{r.comment}</p>
                      {r.pros && (
                        <div className="small text-success mb-1">
                          <strong>Pros:</strong> {r.pros}
                        </div>
                      )}
                      {r.cons && (
                        <div className="small text-danger">
                          <strong>Cons:</strong> {r.cons}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small mb-4">No reviews yet. Be the first to share your experience!</p>
              )}

              {/* Write Review Form */}
              <div className="border-top pt-3">
                <h6 className="fw-bold text-dark mb-3">Leave a Review</h6>
                {reviewSuccess && <div className="alert alert-success py-2 small">{reviewSuccess}</div>}
                {reviewError && <div className="alert alert-danger py-2 small">{reviewError}</div>}

                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Rating (1 to 5 Stars)</label>
                    <select
                      className="form-select form-select-sm"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="5">5 Stars - Outstanding Experience</option>
                      <option value="4">4 Stars - Very Good</option>
                      <option value="3">3 Stars - Average</option>
                      <option value="2">2 Stars - Below Expectations</option>
                      <option value="1">1 Star - Poor</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Your Review Comment</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Share your thoughts on the ventilation, society maintenance, water availability..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Pros (e.g. Near metro, peaceful)"
                        value={reviewPros}
                        onChange={(e) => setReviewPros(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Cons (e.g. Visitor parking rules)"
                        value={reviewCons}
                        onChange={(e) => setReviewCons(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-sm btn-teal px-4"
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Interactive Booking & Schedule Visit Form (Right Sticky Column) */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 border shadow-sm sticky-top" style={{ top: '80px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Connect with Owner</h5>
                <span className="badge bg-success bg-opacity-10 text-success fw-bold">Instant Booking</span>
              </div>

              {/* Tab Selector: Schedule Visit vs Rental Application */}
              <div className="btn-group w-100 mb-3" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${bookingType === 'Schedule Visit' ? 'btn-teal' : 'btn-outline-secondary'}`}
                  onClick={() => setBookingType('Schedule Visit')}
                >
                  <i className="bi bi-calendar2-event me-1"></i> Schedule Visit
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${bookingType === 'Rental Application' ? 'btn-teal' : 'btn-outline-secondary'}`}
                  onClick={() => setBookingType('Rental Application')}
                >
                  <i className="bi bi-file-earmark-check me-1"></i> Apply to Rent
                </button>
              </div>

              {bookingSuccess && (
                <div className="alert alert-success py-2 small mb-3">
                  <i className="bi bi-check-circle-fill me-1"></i> {bookingSuccess}
                </div>
              )}

              {bookingError && (
                <div className="alert alert-danger py-2 small mb-3">
                  <i className="bi bi-exclamation-circle-fill me-1"></i> {bookingError}
                </div>
              )}

              <form onSubmit={handleBookingSubmit}>
                {/* Visit Date */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted mb-1">
                    Preferred Visit Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Visit Time Slot */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted mb-1">Preferred Time Slot</label>
                  <select
                    className="form-select form-select-sm"
                    value={visitTimeSlot}
                    onChange={(e) => setVisitTimeSlot(e.target.value)}
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Noon)</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening)</option>
                    <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM (Night)</option>
                  </select>
                </div>

                {/* If Rental Application: extra fields */}
                {bookingType === 'Rental Application' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted mb-1">Proposed Monthly Rent (₹)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={proposedRent}
                        onChange={(e) => setProposedRent(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted mb-1">Your Employment Type</label>
                      <select
                        className="form-select form-select-sm"
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                      >
                        <option value="IT / Corporate Professional">IT / Corporate Professional</option>
                        <option value="Salaried Employee">Salaried Employee</option>
                        <option value="Business Owner / Entrepreneur">Business Owner / Entrepreneur</option>
                        <option value="Student">Student</option>
                        <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted mb-1">Family Members / Occupants</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min="1"
                        max="10"
                        value={familyMembersCount}
                        onChange={(e) => setFamilyMembersCount(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Contact Phone */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted mb-1">
                    Contact Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control form-control-sm"
                    placeholder="+91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>

                {/* Message */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted mb-1">Message to Landlord</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="2"
                    placeholder="Hello, I am interested in renting your flat..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-teal w-100 py-2 fw-bold shadow-sm"
                  disabled={bookingSubmitting}
                >
                  {bookingSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <span>{bookingType === 'Schedule Visit' ? 'Confirm Visit Request' : 'Submit Rental Application'}</span>
                  )}
                </button>
              </form>

              <div className="mt-3 text-center">
                <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-shield-lock-fill text-teal-main me-1"></i>
                  Your contact details are shared securely only with the verified property owner.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
