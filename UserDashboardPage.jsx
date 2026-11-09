import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatINR, formatDate } from '../utils/formatters';

const UserDashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, profile, password

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [profileMsg, setProfileMsg] = useState(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);

  const fetchUserBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this visit request?')) return;
    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      }
    } catch (err) {
      alert('Failed to cancel booking request');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    const res = await updateProfile({ name, phone, bio, city });
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setProfileMsg({ type: 'danger', text: res.message });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPasswordMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to change password'
      });
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* User Welcome Banner */}
        <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={user?.name}
                className="rounded-circle object-fit-cover shadow-sm"
                style={{ width: '64px', height: '64px' }}
              />
              <div>
                <h4 className="fw-bold text-dark mb-0">{user?.name}</h4>
                <p className="text-muted small mb-0">{user?.email} • {user?.phone} • {user?.city}</p>
                <span className="badge bg-primary bg-opacity-10 text-primary mt-1">Tenant / Renter Account</span>
              </div>
            </div>

            <div className="d-flex gap-2">
              <Link to="/properties" className="btn btn-teal btn-sm px-3 shadow-sm">
                <i className="bi bi-search me-1"></i> Browse More Homes
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="row g-4">
          <div className="col-lg-3">
            <div className="bg-white rounded-4 border p-3 shadow-sm">
              <div className="nav flex-column nav-pills gap-1">
                <button
                  className={`nav-link text-start py-2 px-3 fw-semibold ${activeTab === 'bookings' ? 'active bg-teal-main' : 'text-dark'}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  <i className="bi bi-calendar-check me-2"></i> My Visits & Applications
                </button>
                <button
                  className={`nav-link text-start py-2 px-3 fw-semibold ${activeTab === 'profile' ? 'active bg-teal-main' : 'text-dark'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person-gear me-2"></i> Edit Profile
                </button>
                <button
                  className={`nav-link text-start py-2 px-3 fw-semibold ${activeTab === 'password' ? 'active bg-teal-main' : 'text-dark'}`}
                  onClick={() => setActiveTab('password')}
                >
                  <i className="bi bi-key me-2"></i> Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            {/* Tab 1: Bookings & Visits */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-4 border p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold text-dark mb-0">My Scheduled Visits & Applications</h5>
                    <small className="text-muted">Track landlord approvals and confirmed visit timings</small>
                  </div>
                  <span className="badge bg-light text-secondary border">Total: {bookings.length}</span>
                </div>

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-teal-main" role="status"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-calendar-x text-muted fs-1 mb-2"></i>
                    <h6 className="fw-bold text-dark">No visits scheduled yet</h6>
                    <p className="text-muted small">Explore our verified rental homes and schedule a visit with one click.</p>
                    <Link to="/properties" className="btn btn-teal btn-sm px-4">
                      Explore Properties
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="p-3 rounded-3 border bg-light">
                        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                          <div className="d-flex gap-3">
                            <img
                              src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                              alt="Property"
                              className="rounded-3 object-fit-cover shadow-sm"
                              style={{ width: '90px', height: '80px' }}
                            />
                            <div>
                              <span className="badge bg-dark text-white small me-1">{booking.property?.bhk}</span>
                              <span className="badge bg-light text-secondary border small me-1">{booking.bookingType}</span>
                              <span
                                className={`badge ${
                                  booking.status === 'confirmed'
                                    ? 'bg-success'
                                    : booking.status === 'pending'
                                    ? 'bg-warning text-dark'
                                    : 'bg-secondary'
                                }`}
                              >
                                {booking.status.toUpperCase()}
                              </span>

                              <h6 className="fw-bold text-dark mt-1 mb-0">
                                <Link to={`/properties/${booking.property?._id}`} className="text-dark hover-text-teal">
                                  {booking.property?.title}
                                </Link>
                              </h6>
                              <small className="text-muted d-block">
                                {booking.property?.address?.locality}, {booking.property?.address?.city}
                              </small>
                              <small className="text-teal-main fw-bold">
                                {formatINR(booking.property?.rentAmount)} / month
                              </small>
                            </div>
                          </div>

                          <div className="text-md-end border-top border-md-top-0 pt-2 pt-md-0">
                            <span className="text-muted small d-block">Visit Slot:</span>
                            <span className="fw-bold text-dark small">
                              {formatDate(booking.visitDate)} ({booking.visitTimeSlot})
                            </span>

                            {booking.ownerResponse && (
                              <div className="mt-2 p-2 bg-white rounded border small text-start">
                                <strong>Landlord Note:</strong> {booking.ownerResponse}
                              </div>
                            )}

                            {booking.status === 'pending' && (
                              <button
                                className="btn btn-outline-danger btn-sm mt-2 px-3"
                                onClick={() => handleCancelBooking(booking._id)}
                              >
                                Cancel Request
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Profile Edit */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-4 border p-4 shadow-sm">
                <h5 className="fw-bold text-dark mb-3">Edit Profile & Contact Details</h5>
                {profileMsg && <div className={`alert alert-${profileMsg.type} small py-2`}>{profileMsg.text}</div>}

                <form onSubmit={handleProfileSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">City (India)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Bio / Preferences</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="e.g. Working at an IT firm in Bengaluru, looking for a peaceful 2 BHK."
                      ></textarea>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-teal px-4 shadow-sm">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Tab 3: Password Change */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-4 border p-4 shadow-sm">
                <h5 className="fw-bold text-dark mb-3">Change Account Password</h5>
                {passwordMsg && <div className={`alert alert-${passwordMsg.type} small py-2`}>{passwordMsg.text}</div>}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">New Password (Min 6 chars)</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength="6"
                    />
                  </div>
                  <button type="submit" className="btn btn-teal px-4 shadow-sm">
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
