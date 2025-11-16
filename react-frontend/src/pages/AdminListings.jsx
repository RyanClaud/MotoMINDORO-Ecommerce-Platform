import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  FaMotorcycle, FaSearch, FaTrash, FaEye, FaStore,
  FaArrowLeft, FaFilter, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';

const AdminListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchListings();
  }, [user, navigate, search, statusFilter, conditionFilter, currentPage]);

  const fetchListings = async () => {
    try {
      const params = {
        search,
        page: currentPage,
        per_page: 15
      };
      
      if (statusFilter !== 'all') params.status = statusFilter;
      if (conditionFilter !== 'all') params.condition = conditionFilter;

      const response = await axios.get('http://localhost:8000/api/admin/listings', {
        withCredentials: true,
        params
      });

      if (response.data.success) {
        setListings(response.data.data.data);
        setTotalPages(response.data.data.last_page);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      // Get CSRF token first
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });

      // Get CSRF token from cookie
      const getCsrfToken = () => {
        const name = 'XSRF-TOKEN=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        
        for (let i = 0; i < cookieArray.length; i++) {
          let cookie = cookieArray[i].trim();
          if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
          }
        }
        return null;
      };

      const csrfToken = getCsrfToken();

      await axios.delete(`http://localhost:8000/api/admin/listings/${listingId}`, {
        withCredentials: true,
        headers: {
          'X-XSRF-TOKEN': csrfToken
        }
      });
      
      alert('Listing deleted successfully');
      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Listing Management
              </h1>
              <p className="text-gray-600 mt-2">Manage all motorcycle listings</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-sm text-gray-500">Total Listings</p>
              <p className="text-3xl font-bold text-purple-600">{listings.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-slide-up">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-400 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="sold">Sold</option>
            </select>

            {/* Condition Filter */}
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="all">All Conditions</option>
              <option value="brand_new">Brand New</option>
              <option value="second_hand">Second Hand</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Listing Image */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {(() => {
                  // Get the image URL
                  let imageUrl = null;
                  
                  // Check for primary_image
                  if (listing.primary_image?.image_path) {
                    imageUrl = `http://localhost:8000/storage/${listing.primary_image.image_path}`;
                  }
                  // Check for images array
                  else if (listing.images && listing.images.length > 0) {
                    const primaryImage = listing.images.find(img => img.is_primary) || listing.images[0];
                    if (primaryImage?.image_path) {
                      imageUrl = `http://localhost:8000/storage/${primaryImage.image_path}`;
                    }
                  }

                  return imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null;
                })()}
                {/* Fallback placeholder */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
                  style={{ display: listing.primary_image?.image_path || (listing.images && listing.images.length > 0) ? 'none' : 'flex' }}
                >
                  <FaMotorcycle className="text-6xl text-white opacity-50" />
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                    listing.status === 'published' ? 'bg-green-500 text-white' :
                    listing.status === 'draft' ? 'bg-yellow-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {listing.status}
                  </span>
                </div>

                {/* Condition Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                    listing.condition === 'brand_new' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {listing.condition === 'brand_new' ? 'Brand New' : 'Second Hand'}
                  </span>
                </div>
              </div>

              {/* Listing Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                  {listing.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaStore className="mr-2 text-green-500" />
                  <span>{listing.store?.name}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-bold text-green-600">₱{parseFloat(listing.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="text-lg font-bold text-gray-900">{listing.year}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaEye className="mr-2 text-indigo-500" />
                    <span className="font-semibold">{listing.views}</span>
                    <span className="ml-1">views</span>
                  </div>
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete listing"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold">Model:</span> {listing.model}
                  </div>
                  <div>
                    <span className="font-semibold">Engine:</span> {listing.engine_displacement}cc
                  </div>
                  {listing.mileage && (
                    <div className="col-span-2">
                      <span className="font-semibold">Mileage:</span> {listing.mileage.toLocaleString()} km
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {listings.length === 0 && !loading && (
          <div className="text-center py-12">
            <FaMotorcycle className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No listings found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg px-6 py-4 flex items-center justify-between animate-fade-in">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminListings;
