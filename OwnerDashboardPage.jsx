import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatINR, formatDate } from '../utils/formatters';

const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings'); // listings, inquiries

  // Response modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ownerNote, setOwnerNote] = useState('');
  const [newStatus, setNewStatus] = useState('confirmed');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propsRes, bookingsRes] = await Promise.all([
        api.get('/properties/my/listings'),
        api.get('/bookings/owner-requests')
      ]);

      if (propsRes.data.success) {
        setProperties(propsRes.data.data);
      }
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load owner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      const res = await api.delete(`/properties/${propertyId}`);
      if (res.data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      }
    } catch (err) {
      alert('Failed to delete property listing');
    }
  };

  const handleUpdateBookingStatus = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      const res = await api.put(`/bookings/${selectedBooking._id}/status`, {
        status: newStatus,
        ownerResponse: ownerNote
      });

      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBooking._id
              ? { ...b, status: newStatus, ownerResponse: ownerNote }
              : b
          )
        );
        setSelectedBooking(null);
        setOwnerNote('');
      }
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const approvedCount = properties.filter((p) => p.status === 'approved').length;
  const pendingCount = properties.filter((p) => p.status === 'pending').length;

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header & KPI Summary */}
        <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <span className="badge bg-success bg-opacity-10 text-success fw-bold mb-1">
                <i className="bi bi-patch-check-fill me-1"></i> Verified Landlord Portal
              </span>
              <h3 className="fw-bold text-dark mb-0">Welcome, {user?.name}</h3>
              <p className="text-muted small mb-0">Manage your Indian rental properties and coordinate prospective tenant visits.</p>
            </div>
            <Link to="/post-property" className="btn btn-teal px-4 py-2 fw-bold shadow-sm">
              <i className="bi bi-plus-circle-fill me-2"></i> List New Property Free
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">Total Listed</span>
                <h4 className="fw-bold text-dark mb-0">{properties.length}</h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">Approved & Live</span>
                <h4 className="fw-bold text-success mb-0">{approvedCount}</h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">Under Moderation</span>
                <h4 className="fw-bold text-warning mb-0">{pendingCount}</h4>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">Visit Requests</span>
                <h4 className="fw-bold text-primary mb-0">{bookings.length}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="d-flex gap-2 mb-3">
          <button
            className={`btn ${activeTab === 'listings' ? 'btn-teal' : 'btn-white bg-white border'} rounded-pill px-4 fw-semibold shadow-sm`}
            onClick={() => setActiveTab('listings')}
          >
            <i className="bi bi-house-door me-1"></i> My Properties ({properties.length})
          </button>
          <button
            className={`btn ${activeTab === 'inquiries' ? 'btn-teal' : 'btn-white bg-white border'} rounded-pill px-4 fw-semibold shadow-sm`}
            onClick={() => setActiveTab('inquiries')}
          >
            <i className="bi bi-inbox me-1"></i> Visit Inquiries & Bookings ({bookings.length})
          </button>
        </div>

        {/* Listings Tab Content */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-4 border shadow-sm p-4">
            <h5 className="fw-bold text-dark mb-3">My Property Listings</h5>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-teal-main" role="status"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-house-add text-muted fs-1 mb-2"></i>
                <h6 className="fw-bold text-dark">You have not posted any rental listings yet</h6>
                <p className="text-muted small">Post your apartment or villa to receive verified tenant visit requests.</p>
                <Link to="/post-property" className="btn btn-teal btn-sm px-4">
                  Add Your First Property
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light small">
                    <tr>
                      <th>Property</th>
                      <th>City / Area</th>
                      <th>Rent & Deposit</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                              alt="Property"
                              className="rounded-2 object-fit-cover"
                              style={{ width: '48px', height: '48px' }}
                            />
                            <div>
                              <span className="fw-bold text-dark d-block text-truncate" style={{ maxWidth: '240px' }}>
                                {p.title}
                              </span>
                              <small className="badge bg-light text-secondary border">{p.bhk}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="small fw-semibold text-dark d-block">{p.address?.city}</span>
                          <small className="text-muted">{p.address?.locality}</small>
                        </td>
                        <td>
                          <span className="fw-bold text-teal-main small d-block">{formatINR(p.rentAmount)}/mo</span>
                          <small className="text-muted">Deposit: {formatINR(p.securityDeposit, true)}</small>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              p.status === 'approved'
                                ? 'badge-status-approved'
                                : p.status === 'pending'
                                ? 'badge-status-pending'
                                : 'badge-status-rejected'
                            }`}
                          >
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="small text-muted">{p.viewsCount} views</td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Link to={`/properties/${p._id}`} className="btn btn-sm btn-light border" title="Preview">
                              <i className="bi bi-eye"></i>
                            </Link>
                            <Link to={`/edit-property/${p._id}`} className="btn btn-sm btn-light border" title="Edit">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button
                              onClick={() => handleDeleteProperty(p._id)}
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Inquiries Tab Content */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-4 border shadow-sm p-4">
            <h5 className="fw-bold text-dark mb-3">Tenant Inquiries & Visit Requests</h5>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-teal-main" role="status"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox text-muted fs-1 mb-2"></i>
                <h6 className="fw-bold text-dark">No inquiries received yet</h6>
                <p className="text-muted small">Inquiries from verified tenants will show up here as soon as they schedule a visit.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {bookings.map((b) => (
                  <div key={b._id} className="p-3 rounded-3 border bg-light">
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-teal-main small">{b.bookingType}</span>
                          <span
                            className={`badge ${
                              b.status === 'confirmed'
                                ? 'bg-success'
                                : b.status === 'pending'
                                ? 'bg-warning text-dark'
                                : b.status === 'rejected'
                                ? 'bg-danger'
                                : 'bg-secondary'
                            }`}
                          >
                            {b.status.toUpperCase()}
                          </span>
                        </div>
                        <h6 className="fw-bold text-dark mb-1">
                          Applicant: {b.user?.name} ({b.employmentType || 'Professional'})
                        </h6>
                        <p className="text-muted small mb-1">
                          <i className="bi bi-telephone-fill text-teal-main me-1"></i> {b.contactPhone} •{' '}
                          <i className="bi bi-envelope-fill text-teal-main me-1"></i> {b.user?.email}
                        </p>
                        <p className="small text-secondary mb-1">
                          <strong>Property:</strong> {b.property?.title} ({formatINR(b.property?.rentAmount)}/mo)
                        </p>
                        {b.message && (
                          <div className="p-2 bg-white rounded border small mt-1 text-secondary">
                            "{b.message}"
                          </div>
                        )}
                      </div>

                      <div className="text-md-end border-top border-md-top-0 pt-2 pt-md-0 d-flex flex-column justify-content-between">
                        <div>
                          <span className="text-muted small d-block">Requested Visit Date:</span>
                          <span className="fw-bold text-dark small">{formatDate(b.visitDate)}</span>
                          <span className="d-block small text-muted">Slot: {b.visitTimeSlot}</span>
                        </div>

                        {b.ownerResponse && (
                          <small className="text-muted d-block mt-1">Your reply: "{b.ownerResponse}"</small>
                        )}

                        <div className="mt-2">
                          <button
                            className="btn btn-sm btn-teal px-3"
                            onClick={() => {
                              setSelectedBooking(b);
                              setNewStatus(b.status === 'pending' ? 'confirmed' : b.status);
                              setOwnerNote(b.ownerResponse || '');
                            }}
                          >
                            Update Response
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal for updating booking response */}
        {selectedBooking && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold">Update Tenant Visit Request</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedBooking(null)}
                  ></button>
                </div>
                <form onSubmit={handleUpdateBookingStatus}>
                  <div className="modal-body">
                    <p className="small text-muted mb-3">
                      Responding to <strong>{selectedBooking.user?.name}</strong> for property: <br />
                      <strong>{selectedBooking.property?.title}</strong>
                    </p>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Status</label>
                      <select
                        className="form-select"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="confirmed">Confirmed - Visit Approved</option>
                        <option value="completed">Completed - Visit Finished</option>
                        <option value="rejected">Rejected / Slot Unavailable</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Note / Instructions for Tenant</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="e.g. Visit confirmed! Please meet the building security supervisor at 11 AM."
                        value={ownerNote}
                        onChange={(e) => setOwnerNote(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setSelectedBooking(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-teal px-4">
                      Save Response
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
