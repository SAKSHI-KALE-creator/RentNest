import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import RentCalculator from '../components/RentCalculator';
import { INDIAN_CITIES, BHK_OPTIONS } from '../utils/formatters';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search hero states
  const [city, setCity] = useState('Bengaluru');
  const [bhk, setBhk] = useState('All');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/properties/featured');
        if (res.data.success) {
          setFeaturedProperties(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load featured properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city && city !== 'All') params.append('city', city);
    if (bhk && bhk !== 'All') params.append('bhk', bhk);
    if (search) params.append('search', search);
    if (activeTab !== 'All') params.append('propertyType', activeTab);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient py-5 position-relative">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm">
                <i className="bi bi-shield-check me-1"></i> 100% Verified Landlords & Homes in India
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ lineHeight: '1.15' }}>
                Find Your Perfect <br />
                <span className="text-warning">Rental Home</span> with Ease
              </h1>
              <p className="lead text-light opacity-90 mb-4" style={{ maxWidth: '580px' }}>
                RentNest connects you directly with verified house owners across Bengaluru, Mumbai, Delhi-NCR, Hyderabad, and Pune. Zero hassle, verified homes, and transparent tenancy terms.
              </p>

              {/* Stats badges */}
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-4 pt-2 text-white">
                <div>
                  <h3 className="fw-bold mb-0 text-warning">15,000+</h3>
                  <small className="text-light opacity-75">Indian Listings</small>
                </div>
                <div className="border-start ps-4 border-light border-opacity-25">
                  <h3 className="fw-bold mb-0 text-warning">Zero</h3>
                  <small className="text-light opacity-75">Hidden Brokerage</small>
                </div>
                <div className="border-start ps-4 border-light border-opacity-25">
                  <h3 className="fw-bold mb-0 text-warning">4.9 ★</h3>
                  <small className="text-light opacity-75">Tenant Rating</small>
                </div>
              </div>
            </div>

            {/* Hero Search Box Card */}
            <div className="col-lg-5">
              <div className="hero-overlay-card">
                {/* Search Tabs */}
                <div className="d-flex gap-1 border-bottom pb-2 mb-3">
                  {['All', 'Apartment / Flat', 'Independent House / Villa', 'Penthouse'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`btn btn-sm ${
                        activeTab === tab ? 'btn-teal' : 'btn-light text-secondary'
                      } rounded-pill px-3 py-1 fw-semibold`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === 'All' ? 'All Types' : tab.split(' / ')[0]}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleHeroSearch}>
                  {/* Select City */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">
                      <i className="bi bi-geo-alt-fill text-teal-main me-1"></i> Select City
                    </label>
                    <select
                      className="form-select form-select-lg shadow-sm"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      {INDIAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BHK Configuration */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">
                      <i className="bi bi-door-open-fill text-teal-main me-1"></i> BHK Requirement
                    </label>
                    <select
                      className="form-select shadow-sm"
                      value={bhk}
                      onChange={(e) => setBhk(e.target.value)}
                    >
                      <option value="All">Any BHK Configuration</option>
                      {BHK_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Locality keyword */}
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted mb-1">
                      <i className="bi bi-pin-map text-teal-main me-1"></i> Locality or Landmark
                    </label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      placeholder="e.g. Indiranagar, Bandra, Powai, Cyber City"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-teal w-100 py-3 fs-6 d-flex align-items-center justify-content-center gap-2 shadow"
                  >
                    <i className="bi bi-search"></i>
                    <span>Find Rental Properties</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Indian Metros Showcase */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-teal-main fw-bold text-uppercase small">Prime Real Estate Hubs</span>
              <h2 className="fw-bold text-dark mb-0">Explore Homes by Indian Cities</h2>
            </div>
            <Link to="/properties" className="text-teal-main fw-semibold text-decoration-none mt-2 mt-md-0">
              View All Locations <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-3">
            {INDIAN_CITIES.slice(0, 6).map((item, index) => (
              <div key={item.name} className="col-lg-2 col-md-4 col-6">
                <Link
                  to={`/properties?city=${encodeURIComponent(item.name)}`}
                  className="card border text-center p-3 h-100 rounded-3 rent-card text-decoration-none"
                >
                  <div
                    className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center text-teal-main mb-2"
                    style={{ width: '50px', height: '50px', fontSize: '1.4rem' }}
                  >
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{item.name}</h6>
                  <small className="text-muted d-block text-truncate" style={{ fontSize: '0.72rem' }}>
                    {item.tag}
                  </small>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-teal-main fw-bold text-uppercase small">Handpicked & Verified</span>
              <h2 className="fw-bold text-dark mb-0">Featured Rental Properties</h2>
            </div>
            <Link to="/properties" className="btn btn-outline-teal btn-sm px-3 mt-2 mt-md-0">
              Explore All Listings <i className="bi bi-chevron-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-teal-main" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredProperties.map((property) => (
                <div key={property._id} className="col-lg-4 col-md-6">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Verified Visits & Transparent Tenancy Banner */}
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="badge bg-warning text-dark fw-bold mb-2">Direct Owner Connect</span>
              <h2 className="fw-bold display-6 mb-3">Schedule Physical Visits Directly with Property Owners</h2>
              <p className="text-secondary leading-relaxed mb-4">
                No middleman brokers or unwanted agent calls. Pick your preferred date and time slot, communicate directly with authentic landlords, and inspect the locality with complete confidence.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/properties" className="btn btn-teal px-4 py-2">
                  <i className="bi bi-calendar2-check-fill me-2"></i> Explore & Schedule Visits
                </Link>
                <Link to="/post-property" className="btn btn-outline-light px-4 py-2">
                  Post Your House Listing
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                  alt="Verified Rental Property"
                  className="w-100 h-100 object-fit-cover"
                  style={{ minHeight: '320px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rent Calculator Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <span className="text-teal-main fw-bold text-uppercase small">Financial Planning</span>
            <h2 className="fw-bold text-dark">Estimate Your Ideal Rental Budget</h2>
            <p className="text-muted">Use standard Indian tenancy rules to calculate safe monthly rent and security deposits.</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <RentCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose RentNest */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-teal-main fw-bold text-uppercase small">The RentNest Advantage</span>
            <h2 className="fw-bold text-dark">Why Indian Tenants and Landlords Trust Us</h2>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div
                  className="bg-white text-teal-main rounded-circle shadow-sm mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '60px', height: '60px', fontSize: '1.6rem' }}
                >
                  <i className="bi bi-patch-check-fill text-teal-main"></i>
                </div>
                <h5 className="fw-bold text-dark">100% Verified Listings</h5>
                <p className="text-muted small">
                  Every property undergoes strict admin verification. No fake photos or misleading descriptions.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div
                  className="bg-white text-teal-main rounded-circle shadow-sm mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '60px', height: '60px', fontSize: '1.6rem' }}
                >
                  <i className="bi bi-cash-stack text-success"></i>
                </div>
                <h5 className="fw-bold text-dark">Zero Brokerage Savings</h5>
                <p className="text-muted small">
                  Connect directly with authentic property owners. Save up to 1-2 months of unnecessary agent commission.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div
                  className="bg-white text-teal-main rounded-circle shadow-sm mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '60px', height: '60px', fontSize: '1.6rem' }}
                >
                  <i className="bi bi-file-earmark-text-fill text-warning"></i>
                </div>
                <h5 className="fw-bold text-dark">Digital Tenancy Agreements</h5>
                <p className="text-muted small">
                  Streamlined 11-month rental agreements compliant with state rent control and Model Tenancy regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
