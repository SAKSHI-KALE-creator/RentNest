import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INDIAN_CITIES } from '../utils/formatters';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isOwner, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCity, setSelectedCity] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city) {
      navigate(`/properties?city=${encodeURIComponent(city)}`);
    } else {
      navigate('/properties');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg glass-nav py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center bg-teal-main rounded-3 text-white shadow-sm"
            style={{ width: '42px', height: '42px', fontSize: '1.3rem' }}
          >
            <i className="bi bi-houses-fill"></i>
          </div>
          <div>
            <span className="fw-bold fs-4 text-dark tracking-tight">Rent<span className="text-teal-main">Nest</span></span>
            <span className="d-block text-muted" style={{ fontSize: '0.68rem', marginTop: '-4px', fontWeight: 600 }}>INDIA</span>
          </div>
        </Link>

        {/* City Selector Pill */}
        <div className="d-none d-md-flex align-items-center ms-3 me-auto">
          <div className="input-group input-group-sm rounded-pill overflow-hidden border bg-white px-2 py-1 shadow-sm">
            <span className="input-group-text bg-transparent border-0 text-teal-main p-0 pe-2">
              <i className="bi bi-geo-alt-fill"></i>
            </span>
            <select
              className="form-select form-select-sm border-0 bg-transparent shadow-none fw-medium text-secondary"
              style={{ fontSize: '0.85rem', cursor: 'pointer' }}
              value={selectedCity}
              onChange={handleCityChange}
            >
              <option value="">All Major Cities (India)</option>
              {INDIAN_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-3 text-dark`}></i>
        </button>

        {/* Nav Links & Actions */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 my-2 my-lg-0">
            <li className="nav-item">
              <Link
                to="/properties"
                className={`nav-link fw-semibold px-3 ${location.pathname === '/properties' ? 'text-teal-main' : 'text-dark'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="bi bi-search me-1"></i> Browse Homes
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/calculator"
                className={`nav-link fw-semibold px-3 ${location.pathname === '/calculator' ? 'text-teal-main' : 'text-dark'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="bi bi-calculator me-1"></i> Rent Calculator
              </Link>
            </li>

            {/* Post Property CTA */}
            <li className="nav-item mx-lg-1 my-2 my-lg-0">
              <Link
                to={isAuthenticated ? (isOwner || isAdmin ? '/post-property' : '/owner/dashboard') : '/login'}
                className="btn btn-outline-teal btn-sm px-3 py-2 d-flex align-items-center gap-1 shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="bi bi-plus-circle-fill"></i>
                <span>Post Free Listing</span>
                <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>FREE</span>
              </Link>
            </li>

            {/* User Profile or Login */}
            {isAuthenticated ? (
              <li className="nav-item dropdown ms-lg-2">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center gap-2 p-1 border rounded-pill bg-white shadow-sm"
                  href="#profileMenu"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={user?.name}
                    className="rounded-circle object-fit-cover"
                    style={{ width: '32px', height: '32px' }}
                  />
                  <div className="text-start pe-2 d-none d-sm-block">
                    <span className="d-block fw-bold text-dark lh-1" style={{ fontSize: '0.85rem' }}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span
                      className={`badge mt-1 ${
                        isAdmin ? 'bg-danger' : isOwner ? 'bg-success' : 'bg-primary'
                      }`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {isAdmin ? 'Admin' : isOwner ? 'Landlord' : 'Tenant'}
                    </span>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2 p-2" style={{ minWidth: '220px' }}>
                  <li className="px-3 py-2 border-bottom mb-2">
                    <p className="mb-0 fw-bold text-dark">{user?.name}</p>
                    <small className="text-muted text-truncate d-block">{user?.email}</small>
                  </li>

                  {/* Role Specific Navigation */}
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="dropdown-item py-2 rounded-2 fw-semibold text-danger d-flex align-items-center gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <i className="bi bi-shield-check"></i> Admin Moderation Portal
                      </Link>
                    </li>
                  )}

                  {(isOwner || isAdmin) && (
                    <>
                      <li>
                        <Link
                          to="/owner/dashboard"
                          className="dropdown-item py-2 rounded-2 fw-semibold d-flex align-items-center gap-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <i className="bi bi-speedometer2 text-teal-main"></i> Landlord Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/post-property"
                          className="dropdown-item py-2 rounded-2 fw-semibold d-flex align-items-center gap-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <i className="bi bi-plus-square text-success"></i> Add New Property
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <Link
                      to="/dashboard"
                      className="dropdown-item py-2 rounded-2 fw-semibold d-flex align-items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="bi bi-calendar2-check text-primary"></i> My Visits & Applications
                    </Link>
                  </li>

                  <li><hr className="dropdown-divider my-2" /></li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item py-2 rounded-2 text-danger fw-semibold d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item d-flex align-items-center gap-2 ms-lg-2">
                <Link
                  to="/login"
                  className="btn btn-sm btn-light border px-3 py-2 fw-semibold text-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm btn-teal px-3 py-2 fw-semibold shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
