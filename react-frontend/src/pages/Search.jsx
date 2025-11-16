import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ListingCard from '../components/ListingCard';
import { 
  FaSearch, FaFilter, FaTimes, FaSlidersH, FaThLarge, FaList,
  FaMotorcycle, FaMapMarkerAlt, FaSortAmountDown
} from 'react-icons/fa';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [brands, setBrands] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    brand_id: '',
    condition: '',
    min_price: '',
    max_price: '',
    min_year: '',
    max_year: '',
    min_engine: '',
    max_engine: '',
    sort: 'newest',
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchBrands();
    fetchListings();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      fetchFavorites();
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      const favoriteIds = new Set(response.data.data.map(fav => fav.id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const response = await api.get(`/listings?${params.toString()}`);
      setListings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brand_id: '',
      condition: '',
      min_price: '',
      max_price: '',
      min_year: '',
      max_year: '',
      min_engine: '',
      max_engine: '',
      sort: 'newest',
    });
    setTimeout(() => fetchListings(), 100);
  };

  const handleFavorite = async (listingId) => {
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      navigate('/login');
      return;
    }

    try {
      await api.post(`/favorites`, { motorcycles_listing_id: listingId });
      
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(listingId)) {
          newFavorites.delete(listingId);
        } else {
          newFavorites.add(listingId);
        }
        return newFavorites;
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'newest').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Header with Background */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <FaMotorcycle className="inline mr-2 text-2xl" />
            <span className="font-semibold">Discover Your Dream Ride</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Search <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Motorcycles</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Find your perfect ride from thousands of listings across <span className="font-bold text-white"> Oriental Mindoro</span>
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-sm text-blue-100">Motorcycles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-blue-100">Verified Stores</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-sm text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by brand, model, or keyword..."
              className="w-full px-6 py-4 pr-32 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              <FaSearch className="inline mr-2" />
              Search
            </button>
          </form>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                showFilters 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500'
              }`}
            >
              <FaSlidersH />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all"
              >
                <FaTimes />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">
              <span className="text-blue-600 font-bold">{listings.length}</span> results
            </span>

            <div className="flex items-center space-x-2 bg-white rounded-xl border-2 border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaFilter className="mr-2 text-blue-600" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brand
                    </label>
                    <select
                      name="brand_id"
                      value={filters.brand_id}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Condition
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: '', label: 'All' },
                        { value: 'brand_new', label: 'Brand New' },
                        { value: 'second_hand', label: 'Second Hand' }
                      ].map(option => (
                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="condition"
                            value={option.value}
                            checked={filters.condition === option.value}
                            onChange={handleFilterChange}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price Range (₱)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="min_price"
                        value={filters.min_price}
                        onChange={handleFilterChange}
                        placeholder="Min"
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                      <input
                        type="number"
                        name="max_price"
                        value={filters.max_price}
                        onChange={handleFilterChange}
                        placeholder="Max"
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>
                  </div>

                  {/* Year Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Year
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="min_year"
                        value={filters.min_year}
                        onChange={handleFilterChange}
                        placeholder="From"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                      <input
                        type="number"
                        name="max_year"
                        value={filters.max_year}
                        onChange={handleFilterChange}
                        placeholder="To"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>
                  </div>

                  {/* Engine Displacement */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Engine (cc)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="min_engine"
                        value={filters.min_engine}
                        onChange={handleFilterChange}
                        placeholder="Min"
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                      <input
                        type="number"
                        name="max_engine"
                        value={filters.max_engine}
                        onChange={handleFilterChange}
                        placeholder="Max"
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaSortAmountDown className="inline mr-2" />
                      Sort By
                    </label>
                    <select
                      name="sort"
                      value={filters.sort}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="views">Most Viewed</option>
                    </select>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={fetchListings}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200"></div>
                  <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 absolute top-0"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Searching motorcycles...</p>
              </div>
            ) : listings.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
              }>
                {listings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ListingCard 
                      listing={listing}
                      onFavorite={isAuthenticated ? handleFavorite : null}
                      isFavorited={favorites.has(listing.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
                  <FaMotorcycle className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Search;
