import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="py-5 text-center min-vh-75 d-flex align-items-center justify-content-center">
      <div className="bg-white p-5 rounded-4 border shadow-sm my-5" style={{ maxWidth: '500px' }}>
        <h1 className="display-1 fw-extrabold text-teal-main mb-2">404</h1>
        <h4 className="fw-bold text-dark mb-2">Page Not Found</h4>
        <p className="text-muted small mb-4">
          The property listing or rental page you are seeking does not exist or has moved.
        </p>
        <Link to="/" className="btn btn-teal px-4 shadow-sm">
          Return to RentNest Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
