import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'owner') navigate('/owner/dashboard');
      else navigate(redirectPath);
    } else {
      setError(res.message);
    }
  };

  // Quick Demo Login helper
  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setSubmitting(true);
    setError(null);
    const res = await login(demoEmail, demoPassword);
    setSubmitting(false);
    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'owner') navigate('/owner/dashboard');
      else navigate(redirectPath);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
              {/* Brand Logo & Header */}
              <div className="text-center mb-4">
                <div
                  className="bg-teal-main rounded-circle text-white d-inline-flex align-items-center justify-content-center mb-2 shadow-sm"
                  style={{ width: '56px', height: '56px', fontSize: '1.6rem' }}
                >
                  <i className="bi bi-houses-fill"></i>
                </div>
                <h4 className="fw-bold text-dark mb-1">Welcome Back to RentNest</h4>
                <p className="text-muted small">Sign in to manage your rental homes and visit requests</p>
              </div>

              {error && <div className="alert alert-danger py-2 small shadow-sm">{error}</div>}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label small fw-bold text-muted mb-1">Password</label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-teal w-100 py-2 fw-bold shadow-sm mb-3"
                  disabled={submitting}
                >
                  {submitting ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              {/* Quick Demo Login Credentials */}
              <div className="pt-3 border-top text-center">
                <span className="text-muted small fw-semibold d-block mb-2">⚡ Quick Test Sign-In:</span>
                <div className="d-flex flex-column gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger d-flex justify-content-between align-items-center"
                    onClick={() => handleDemoLogin('admin@rentnest.in', 'Admin@123')}
                  >
                    <span><i className="bi bi-shield-lock-fill me-1"></i> Admin Portal</span>
                    <small className="opacity-75">admin@rentnest.in</small>
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success d-flex justify-content-between align-items-center"
                    onClick={() => handleDemoLogin('rajesh.sharma@rentnest.in', 'Owner@123')}
                  >
                    <span><i className="bi bi-building-check me-1"></i> Landlord / Owner</span>
                    <small className="opacity-75">rajesh.sharma@rentnest.in</small>
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary d-flex justify-content-between align-items-center"
                    onClick={() => handleDemoLogin('arjun.verma@rentnest.in', 'User@123')}
                  >
                    <span><i className="bi bi-person-fill me-1"></i> Tenant / Renter</span>
                    <small className="opacity-75">arjun.verma@rentnest.in</small>
                  </button>
                </div>
              </div>

              {/* Register link */}
              <div className="text-center mt-4">
                <small className="text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-teal-main fw-bold text-decoration-none">
                    Register for Free
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

export default LoginPage;
