import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import architectService from "../services/architectService.js";
import Footer from "../components/Footer.jsx";

const ArchitectsListingPage = () => {
  const [architects, setArchitects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    specialization: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch architects whenever filters change
  useEffect(() => {
    fetchArchitects();
  }, [debouncedSearch, filters.location, filters.specialization, filters.minPrice, filters.maxPrice, filters.sortBy]);

  const fetchArchitects = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = {
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.location && { location: filters.location }),
        ...(filters.specialization && { specialization: filters.specialization }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        sortBy: filters.sortBy,
      };

      const response = await architectService.getAllArchitects(queryParams);
      setArchitects(response.architects);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load architects");
      console.error("Error fetching architects:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      specialization: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== "createdAt").length;

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 w-full">
        <div className="px-8 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-3xl">🏠</span>
            <h1 className="text-2xl font-bold text-black">Cozy Corner</h1>
          </Link>
          <Link to="/" className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition">
            Home
          </Link>
        </div>
      </nav>

      <div className="w-full py-12 px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">Discover Architects</h1>
          <p className="text-xl text-gray-600">Find the perfect professional for your project</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search by architect name or location..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent bg-white text-black placeholder-gray-400 text-lg"
            />
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-3xl p-8 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-black">Advanced Filters</h2>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#CDB4DB] hover:text-black font-medium transition"
              >
                Clear all ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Location Filter */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-black mb-2">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City or region..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent bg-white"
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <label htmlFor="specialization" className="block text-sm font-semibold text-black mb-2">
                Specialization
              </label>
              <select
                id="specialization"
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent bg-white"
              >
                <option value="">All types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="hospitality">Hospitality</option>
                <option value="retail">Retail</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {/* Min Price Filter */}
            <div>
              <label htmlFor="minPrice" className="block text-sm font-semibold text-black mb-2">
                Min Price ($)
              </label>
              <input
                id="minPrice"
                name="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min hourly rate"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent bg-white"
                min="0"
              />
            </div>

            {/* Max Price Filter */}
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-semibold text-black mb-2">
                Max Price ($)
              </label>
              <input
                id="maxPrice"
                name="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max hourly rate"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent bg-white"
                min="0"
              />
            </div>

            {/* Sort By Filter */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-semibold text-black mb-2">
                Sort By
              </label>
              <select
                id="sortBy"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent bg-white"
              >
                <option value="createdAt">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="pricing">Lowest Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDB4DB] mx-auto mb-4"></div>
              <p className="text-gray-600">Searching architects...</p>
            </div>
          </div>
        ) : architects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl mb-2">No architects found matching your criteria.</p>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-8 font-medium">{architects.length} architect{architects.length !== 1 ? 's' : ''} found</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {architects.map((architect) => (
                <Link
                  key={architect._id}
                  to={`/architects/${architect._id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Image Section */}
                  {architect.portfolioImages?.length > 0 && (
                    <div className="h-56 overflow-hidden bg-gray-200 relative">
                      <img
                        src={architect.portfolioImages[0].url}
                        alt={architect.portfolioImages[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-md">
                        <p className="text-sm font-semibold text-black">${architect.pricing}/hr</p>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Architect Name */}
                    <h3 className="text-xl font-bold text-black mb-1 group-hover:text-[#CDB4DB] transition">
                      {architect.userId?.name || "Unnamed"}
                    </h3>

                    {/* Location */}
                    <p className="text-sm text-gray-500 mb-4">📍 {architect.location}</p>

                    {/* Rating */}
                    {architect.rating > 0 && (
                      <div className="flex items-center mb-4">
                        <div className="flex text-[#CDB4DB]">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-lg">{i < Math.round(architect.rating) ? "★" : "☆"}</span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          ({architect.reviewCount})
                        </span>
                      </div>
                    )}

                    {/* Experience */}
                    <p className="text-sm text-gray-600 mb-2">💼 {architect.experience} years</p>

                    {/* Specializations */}
                    {architect.specializations?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {architect.specializations.slice(0, 2).map((spec) => (
                          <span
                            key={spec}
                            className="inline-block px-3 py-1 bg-[#CDB4DB] bg-opacity-20 text-black text-xs rounded-full capitalize font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                        {architect.specializations.length > 2 && (
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                            +{architect.specializations.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bio Preview */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-6">{architect.bio}</p>

                    {/* View Profile Button */}
                    <button className="w-full py-3 px-4 bg-[#CDB4DB] text-black font-semibold rounded-xl hover:bg-opacity-90 transition">
                      View Profile →
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ArchitectsListingPage;
