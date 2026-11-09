import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatINR, formatDate } from '../utils/formatters';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('moderation'); // moderation, all_properties, users, bookings

  // Property filter in admin
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('all');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, propsRes, usersRes, bookingsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/properties'),
        api.get('/admin/users'),
        api.get('/admin/bookings')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (propsRes.data.success) setProperties(propsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Update property status (Approve / Reject)
  const handleUpdateStatus = async (propertyId, status) => {
    try {
      const res = await api.put(`/admin/properties/${propertyId}/status`, { status });
      if (res.data.success) {
        setProperties((prev) =>
          prev.map((p) => (p._id === propertyId ? { ...p, status } : p))
        );
        // Refresh dashboard stats in background
        const statsRes = await api.get('/admin/dashboard');
        if (statsRes.data.success) setStats(statsRes.data.data);
      }
    } catch (err) {
      alert('Failed to update property status');
    }
  };

  // Delete property
  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      const res = await api.delete(`/properties/${propertyId}`);
      if (res.data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      }
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  // Update user role
  const handleUpdateUserRole = async (userId, role) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role } : u))
        );
      }
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? This will also remove all their associated listings.')) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const pendingListings = properties.filter((p) => p.status === 'pending');

  const filteredProperties = properties.filter((p) => {
    if (propertyStatusFilter === 'all') return true;
    return p.status === propertyStatusFilter;
  });

  const filteredUsers = users.filter((u) => {
    if (userRoleFilter === 'all') return true;
    return u.role === userRoleFilter;
  });

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Admin Header */}
        <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <span className="badge bg-danger bg-opacity-10 text-danger fw-bold mb-1">
                <i className="bi bi-shield-shaded me-1"></i> Admin Portal
              </span>
              <h3 className="fw-bold text-dark mb-0">Platform Moderation & Management</h3>
              <p className="text-muted small mb-0">RentNest India Super-Admin Control Panel</p>
            </div>
            <button
              onClick={fetchAdminData}
              className="btn btn-outline-secondary btn-sm px-3"
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh System Data
            </button>
          </div>

          {/* Metrics KPIs */}
          <div className="row g-3">
            <div className="col-lg-2 col-md-4 col-6">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">Total Properties</span>
                <h4 className="fw-bold text-dark mb-0">{stats?.counts?.totalProperties || 0}</h4>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <div className="p-3 bg-warning bg-opacity-10 border border-warning rounded-3">
                <span className="text-warning-emphasis small fw-bold d-block">Pending Approval</span>
                <h4 className="fw-bold text-warning-emphasis mb-0">{stats?.counts?.pendingProperties || 0}</h4>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <div className="p-3 bg-success bg-opacity-10 border border-success rounded-3">
                <span className="text-success small fw-bold d-block">Live / Approved</span>
                <h4 className="fw-bold text-success mb-0">{stats?.counts?.approvedProperties || 0}</h4>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">Total Users</span>
                <h4 className="fw-bold text-dark mb-0">{stats?.counts?.totalUsers || 0}</h4>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">Owners / Landlords</span>
                <h4 className="fw-bold text-dark mb-0">{stats?.counts?.totalOwners || 0}</h4>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">Total Bookings</span>
                <h4 className="fw-bold text-teal-main mb-0">{stats?.counts?.totalBookings || 0}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button
            className={`btn ${activeTab === 'moderation' ? 'btn-teal' : 'btn-white bg-white border'} rounded-pill px-4 fw-semibold shadow-sm`}
            onClick={() => setActiveTab('moderation')}
          >
            <i className="bi bi-shield-check me-1"></i> Pending Approvals ({pendingListings.length})
          </button>
          <button
            className={`btn ${activeTab === 'all_properties' ? 'btn-teal' : 'btn-white bg-white border'} rounded-pill px-4 fw-semibold shadow-sm`}
            onClick={() => setActiveTab('all_properties')}
          >
            <i className="bi bi-houses me-1"></i> All Properties ({properties.length})
          </button>
          <button
            className={`btn ${activeTab === 'users' ? 'btn-teal' : 'btn-white bg-white border'} rounded-pill px-4 fw-semibold shadow-sm`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-1"></i> User Management ({users.length})
          </button>
          <button
            className={`btn ${activeTab === 'bookings' ? 'btn-teal' : 'btn-white bg-white border'} rounded-pill px-4 fw-semibold shadow-sm`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="bi bi-calendar-week me-1"></i> Platform Bookings ({bookings.length})
          </button>
        </div>

        {/* Tab 1: Moderation / Pending Approvals */}
        {activeTab === 'moderation' && (
          <div className="bg-white rounded-4 border shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-0">Listings Awaiting Moderation</h5>
                <small className="text-muted">Review property details before making them public on RentNest India</small>
              </div>
              <span className="badge bg-warning text-dark px-3 py-2 fw-bold">
                {pendingListings.length} Pending
              </span>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-teal-main" role="status"></div>
              </div>
            ) : pendingListings.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-check2-circle text-success fs-1 mb-2"></i>
                <h6 className="fw-bold text-dark">All listings are moderated and up to date!</h6>
                <p className="text-muted small">New listings submitted by property owners will automatically appear here.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light small">
                    <tr>
                      <th>Property</th>
                      <th>City / State</th>
                      <th>Landlord</th>
                      <th>Rent (INR)</th>
                      <th>Submitted On</th>
                      <th className="text-end">Moderation Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingListings.map((p) => (
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
                              <span className="fw-bold text-dark d-block text-truncate" style={{ maxWidth: '220px' }}>
                                {p.title}
                              </span>
                              <small className="text-muted">{p.bhk} • {p.propertyType}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="small fw-bold text-dark d-block">{p.address?.city}</span>
                          <small className="text-muted">{p.address?.locality}</small>
                        </td>
                        <td>
                          <span className="small fw-semibold text-dark d-block">{p.owner?.name}</span>
                          <small className="text-muted">{p.owner?.email}</small>
                        </td>
                        <td className="fw-bold text-teal-main small">
                          {formatINR(p.rentAmount)}/mo
                        </td>
                        <td className="small text-muted">{formatDate(p.createdAt)}</td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Link to={`/properties/${p._id}`} className="btn btn-sm btn-light border" title="Preview">
                              <i className="bi bi-eye"></i>
                            </Link>
                            <button
                              onClick={() => handleUpdateStatus(p._id, 'approved')}
                              className="btn btn-sm btn-success px-3 fw-semibold"
                            >
                              <i className="bi bi-check-lg me-1"></i> Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(p._id, 'rejected')}
                              className="btn btn-sm btn-outline-danger px-2"
                            >
                              <i className="bi bi-x-lg me-1"></i> Reject
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

        {/* Tab 2: All Properties */}
        {activeTab === 'all_properties' && (
          <div className="bg-white rounded-4 border shadow-sm p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
              <h5 className="fw-bold text-dark mb-0">All System Properties</h5>
              <div className="d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  value={propertyStatusFilter}
                  onChange={(e) => setPropertyStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>Title</th>
                    <th>City</th>
                    <th>Rent</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <span className="fw-bold text-dark d-block text-truncate" style={{ maxWidth: '240px' }}>
                          <Link to={`/properties/${p._id}`} className="text-dark hover-text-teal">
                            {p.title}
                          </Link>
                        </span>
                        <small className="text-muted">{p.bhk} • {p.propertyType}</small>
                      </td>
                      <td className="small">{p.address?.city}</td>
                      <td className="small fw-bold text-teal-main">{formatINR(p.rentAmount)}</td>
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
                          {p.status}
                        </span>
                      </td>
                      <td className="small text-muted">{p.owner?.name}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          {p.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(p._id, 'approved')}
                              className="btn btn-sm btn-outline-success"
                              title="Approve"
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                          )}
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
          </div>
        )}

        {/* Tab 3: User Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-4 border shadow-sm p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
              <h5 className="fw-bold text-dark mb-0">Platform User Directory</h5>
              <select
                className="form-select form-select-sm"
                style={{ width: '180px' }}
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">Tenants (user)</option>
                <option value="owner">Landlords (owner)</option>
                <option value="admin">Administrators (admin)</option>
              </select>
            </div>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                            alt={u.name}
                            className="rounded-circle"
                            style={{ width: '32px', height: '32px' }}
                          />
                          <span className="fw-bold text-dark small">{u.name}</span>
                        </div>
                      </td>
                      <td className="small text-muted">{u.email}</td>
                      <td className="small text-muted">{u.phone}</td>
                      <td className="small">{u.city}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                          style={{ width: '110px' }}
                        >
                          <option value="user">Tenant</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="small text-muted">{formatDate(u.createdAt)}</td>
                      <td className="text-end">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Delete User"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: All Platform Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-4 border shadow-sm p-4">
            <h5 className="fw-bold text-dark mb-3">System-Wide Booking Requests & Visits</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>Property</th>
                    <th>Tenant</th>
                    <th>Landlord</th>
                    <th>Visit Date & Slot</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <span className="fw-bold text-dark d-block text-truncate small" style={{ maxWidth: '200px' }}>
                          {b.property?.title}
                        </span>
                        <small className="text-teal-main">{formatINR(b.property?.rentAmount)}/mo</small>
                      </td>
                      <td>
                        <span className="small fw-semibold text-dark d-block">{b.user?.name}</span>
                        <small className="text-muted">{b.contactPhone}</small>
                      </td>
                      <td>
                        <span className="small text-dark d-block">{b.owner?.name}</span>
                        <small className="text-muted">{b.owner?.email}</small>
                      </td>
                      <td className="small">
                        <span className="fw-bold d-block">{formatDate(b.visitDate)}</span>
                        <small className="text-muted">{b.visitTimeSlot}</small>
                      </td>
                      <td className="small">{b.bookingType}</td>
                      <td>
                        <span
                          className={`badge ${
                            b.status === 'confirmed'
                              ? 'bg-success'
                              : b.status === 'pending'
                              ? 'bg-warning text-dark'
                              : 'bg-secondary'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
