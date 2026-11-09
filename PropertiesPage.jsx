import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state initialized from URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || 'All',
    propertyType: searchParams.get('propertyType') || 'All',
    bhk: searchParams.get('bhk') || 'All',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    furnishing: searchParams.get('furnishing') || 'All',
    preferredTenants: searchParams.get('preferredTenants') || 'All',
    amenities: searchParams.get('amenities') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  });

  // Update query params in URL
  const updateQueryParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (
        newFilters[key] &&
        newFilters[key] !== 'All' &&
        newFilters[key] !== '' &&
        (key !== 'page' || newFilters[key] > 1)
      ) {
        params.set(key, newFilters[key]);
      }
    });
    setSearchParams(params);
  };

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    updateQueryParams(updatedFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      city: 'All',
      propertyType: 'All',
      bhk: 'All',
      minRent: '',
      maxRent: '',
      furnishing: 'All',
      preferredTenants: 'All',
      amenities: '',
      sort: 'newest',
      page: 1
    };
    setFilters(defaultFilters);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const updated = { ...filters, page: newPage };
      setFilters(updated);
      updateQueryParams(updated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fetch properties whenever filters or searchParams change
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.city && filters.city !== 'All') queryParams.append('city', filters.city);
        if (filters.propertyType && filters.propertyType !== 'All')
          queryParams.append('propertyType', filters.propertyType);
        if (filters.bhk && filters.bhk !== 'All') queryParams.append('bhk', filters.bhk);
        if (filters.minRent) queryParams.append('minRent', filters.minRent);
        if (filters.maxRent) queryParams.append('maxRent', filters.maxRent);
        if (filters.furnishing && filters.furnishing !== 'All')
          queryParams.append('furnishing', filters.furnishing);
        if (filters.preferredTenants && filters.preferredTenants !== 'All')
          queryParams.append('preferredTenants', filters.preferredTenants);
        if (filters.amenities) queryParams.append('amenities', filters.amenities);
        if (filters.sort) queryParams.append('sort', filters.sort);
        queryParams.append('page', filters.page);
        queryParams.append('limit', 9);

        const res = await api.get(`/properties?${queryParams.toString()}`);
        if (res.data.success) {
          setProperties(res.data.data);
          setTotalCount(res.data.total);
          setTotalPages(res.data.pages || 1);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams, filters.page, filters.sort]);

  return (
    <div className="py-4">
      <div className="container">
        {/* Breadcrumb / Title Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">
              Explore Rental Properties in India
            </h3>
            <p className="text-muted small mb-0">
              Showing <strong>{totalCount}</strong> verified houses, apartments and villas available for rent
            </p>
          </div>

          {/* Sort Selector */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
            <label className="text-muted small fw-semibold text-nowrap">Sort By:</label>
            <select
              className="form-select form-select-sm shadow-sm"
              value={filters.sort || 'newest'}
              onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
              style={{ minWidth: '180px' }}
            >
              <option value="newest">Newest Listed</option>
              <option value="price_asc">Rent: Low to High</option>
              <option value="price_desc">Rent: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Viewed</option>
              <option value="area">Carpet Area</option>
            </select>
          </div>
        </div>

        {/* Filter Bar Component */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-teal-main" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading Properties...</span>
            </div>
            <p className="text-muted mt-2">Fetching verified Indian listings...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-4 border p-5 text-center my-4 shadow-sm">
            <div
              className="bg-light text-muted rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px', fontSize: '2rem' }}
            >
              <i className="bi bi-search"></i>
            </div>
            <h4 className="fw-bold text-dark">No rental homes matched your criteria</h4>
            <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
              Try adjusting your price range, selected city, or clearing some amenity filters to see more verified Indian homes.
            </p>
            <button className="btn btn-teal px-4 py-2 mt-2" onClick={handleResetFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {properties.map((property) => (
                <div key={property._id} className="col-lg-4 col-md-6">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                <button
                  className="btn btn-outline-secondary btn-sm px-3"
                  disabled={filters.page <= 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                >
                  <i className="bi bi-chevron-left me-1"></i> Previous
                </button>
                <span className="text-muted small px-2">
                  Page <strong>{filters.page}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm px-3"
                  disabled={filters.page >= totalPages}
                  onClick={() => handlePageChange(filters.page + 1)}
                >
                  Next <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
