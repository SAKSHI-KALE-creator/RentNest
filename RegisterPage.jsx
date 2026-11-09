import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INDIAN_CITIES } from '../utils/formatters';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('user'); // 'user' or 'owner'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    const found = INDIAN_CITIES.find((c) => c.name === selectedCity);
    if (found) setState(found.state);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await register({
      name,
      email,
      password,
      role,
      phone,
      city,
      state
    });

    setSubmitting(false);

    if (res.success) {
      if (role === 'owner') navigate('/owner/dashboard');
      else navigate('/properties');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-6">
            <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="bg-teal-main rounded-circle text-white d-inline-flex align-items-center justify-content-center mb-2 shadow-sm"
                  style={{ width: '56px', height: '56px', fontSize: '1.6rem' }}
                >
                  <i className="bi bi-houses-fill"></i>
                </div>
                <h4 className="fw-bold text-dark mb-1">Create Your RentNest Account</h4>
                <p className="text-muted small">Join India's most trusted real estate rental community</p>
              </div>

              {error && <div className="alert alert-danger py-2 small shadow-sm">{error}</div>}

              {/* Account Type Selector Tabs */}
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <div
                    className={`p-3 rounded-3 border text-center cursor-pointer transition ${
                      role === 'user' ? 'border-primary bg-primary bg-opacity-10 text-primary fw-bold' : 'bg-light text-secondary'
                    }`}
                    onClick={() => setRole('user')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="bi bi-person-heart fs-4 d-block mb-1"></i>
                    <span className="small">I'm a Renter / Tenant</span>
                  </div>
                </div>

                <div className="col-6">
                  <div
                    className={`p-3 rounded-3 border text-center cursor-pointer transition ${
                      role === 'owner' ? 'border-success bg-success bg-opacity-10 text-success fw-bold' : 'bg-light text-secondary'
                    }`}
                    onClick={() => setRole('owner')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="bi bi-building-add fs-4 d-block mb-1"></i>
                    <span className="small">I'm a Landlord / Owner</span>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Full Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Password <span className="text-danger">*</span></label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength="6"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Contact Phone <span className="text-danger">*</span></label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">City</label>
                    <select className="form-select" value={city} onChange={handleCityChange}>
                      {INDIAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-teal w-100 py-2 fw-bold shadow-sm mb-3"
                  disabled={submitting}
                >
                  {submitting ? 'Creating Account...' : `Register as ${role === 'owner' ? 'Landlord' : 'Tenant'}`}
                </button>
              </form>

              <div className="text-center mt-3 pt-3 border-top">
                <small className="text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-teal-main fw-bold text-decoration-none">
                    Log In
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
