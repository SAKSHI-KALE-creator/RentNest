import React from 'react';
import { Link } from 'react-router-dom';
import { INDIAN_CITIES } from '../utils/formatters';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5 border-top">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center bg-teal-main rounded-3 text-white shadow-sm"
                style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}
              >
                <i className="bi bi-houses-fill"></i>
              </div>
              <span className="fw-bold fs-4 text-white">Rent<span className="text-teal-main">Nest</span> India</span>
            </div>
            <p className="text-secondary small leading-relaxed">
              India's premier real estate house rental platform connecting renters directly with verified property owners. Experience seamless verified listings, direct landlord contact, zero-hidden charges, and transparent lease management across top metropolitan cities.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#facebook" className="text-secondary fs-5 hover-text-teal"><i className="bi bi-facebook"></i></a>
              <a href="#twitter" className="text-secondary fs-5 hover-text-teal"><i className="bi bi-twitter-x"></i></a>
              <a href="#instagram" className="text-secondary fs-5 hover-text-teal"><i className="bi bi-instagram"></i></a>
              <a href="#linkedin" className="text-secondary fs-5 hover-text-teal"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold text-white mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Explore</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/properties" className="text-secondary text-decoration-none hover-white">Browse Rental Homes</Link></li>
              <li><Link to="/properties?furnishing=Furnished" className="text-secondary text-decoration-none hover-white">Furnished Flats</Link></li>
              <li><Link to="/properties?propertyType=Penthouse" className="text-secondary text-decoration-none hover-white">Luxury Penthouses</Link></li>
              <li><Link to="/properties?propertyType=Independent%20House%20/%20Villa" className="text-secondary text-decoration-none hover-white">Gated Villas</Link></li>
              <li><Link to="/calculator" className="text-secondary text-decoration-none hover-white">Rent Affordability Tool</Link></li>
            </ul>
          </div>

          {/* Top Indian Cities */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-white mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Top Indian Metros</h6>
            <div className="row g-1">
              {INDIAN_CITIES.map((c) => (
                <div key={c.name} className="col-6">
                  <Link
                    to={`/properties?city=${encodeURIComponent(c.name)}`}
                    className="text-secondary small text-decoration-none d-block py-1 hover-white"
                  >
                    <i className="bi bi-chevron-right me-1 text-teal-main" style={{ fontSize: '0.7rem' }}></i>
                    {c.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Support & Contact */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-white mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>India Support</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt-fill text-teal-main mt-1"></i>
                <span>MG Road, Indiranagar, Bengaluru, Karnataka - 560038</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-telephone-fill text-teal-main"></i>
                <span>+91 1800 266 9900 (Toll Free)</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-envelope-fill text-teal-main"></i>
                <span>support@rentnest.in</span>
              </li>
              <li className="mt-2">
                <div className="p-2 rounded bg-secondary bg-opacity-25 border border-secondary border-opacity-25">
                  <span className="badge bg-success mb-1">RERA & Tenancy Compliant</span>
                  <small className="d-block text-secondary" style={{ fontSize: '0.72rem' }}>
                    Follows Model Tenancy Act guidelines for transparent Indian lease agreements.
                  </small>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row align-items-center small text-secondary">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            &copy; {new Date().getFullYear()} RentNest Technologies India Pvt. Ltd. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end d-flex justify-content-center justify-content-md-end gap-3">
            <a href="#privacy" className="text-secondary text-decoration-none">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="text-secondary text-decoration-none">Rental Terms</a>
            <span>•</span>
            <a href="#security" className="text-secondary text-decoration-none">Verified Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
