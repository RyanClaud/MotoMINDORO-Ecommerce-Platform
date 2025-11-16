import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import SimilarListings from '../components/SimilarListings';
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaStore, 
  FaTachometerAlt, FaCog, FaCalendar, FaRoad, FaCheckCircle,
  FaTimes, FaChevronLeft, FaChevronRight, FaShareAlt, FaEdit,
  FaRegHeart, FaEye, FaTag, FaMotorcycle, FaComments
} from 'react-icons/fa';

const ListingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetchListing();
    if (user) {
      checkFavoriteStatus();
    }
  }, [id, user]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/listings/${id}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await api.get('/favorites');
      const favorites = response.data.data || [];
      // Check if the current listing is in favorites
      // favorites might have listing_id or the listing object
      setIsFavorite(favorites.some(fav => {
        const listingId = fav.listing_id || fav.motorcycles_listing_id || (fav.listing && fav.listing.id);
        return listingId === parseInt(id);
      }));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please login to add favorites');
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      // Use the toggle endpoint - POST /favorites/{listingId}
      const response = await api.post(`/favorites/${id}`);
      
      // Update state based on response
      if (response.data.is_favorited !== undefined) {
        setIsFavorite(response.data.is_favorited);
      } else {
        // Toggle the current state
        setIsFavorite(!isFavorite);
      }
      
      // Show success message
      const message = response.data.is_favorited ? 'Added to favorites!' : 'Removed from favorites';
      console.log(message);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listing) {
    return <div className="text-center py-12">Listing not found</div>;
  }

  // Get all images
  const getAllImages = () => {
    if (listing.images && listing.images.length > 0) {
      return listing.images.map(img => `http://localhost:8000/storage/${img.image_path}`);
    }
    return ['https://via.placeholder.com/800x600?text=No+Image'];
  };

  const images = listing ? getAllImages() : [];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this ${listing.title} for ₱${parseFloat(listing.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const isOwner = user && listing && user.id === listing.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Main Image - Premium Design */}
            <div className="group relative bg-white rounded-3xl shadow-2xl p-1 overflow-hidden mb-6 hover:shadow-3xl transition-all duration-500">
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Inner Image Container */}
              <div className="relative bg-white rounded-3xl overflow-hidden">
                <img
                  src={images[selectedImageIndex]}
                  alt={listing.title}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=No+Image'; }}
                  className="w-full h-96 lg:h-[550px] object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
                  onClick={() => setShowLightbox(true)}
                />
                
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                {/* Image Navigation - Enhanced */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white p-4 rounded-2xl shadow-2xl transition-all transform hover:scale-110 hover:-translate-x-1 border-2 border-white/50"
                    >
                      <FaChevronLeft className="text-gray-800 text-xl" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white p-4 rounded-2xl shadow-2xl transition-all transform hover:scale-110 hover:translate-x-1 border-2 border-white/50"
                    >
                      <FaChevronRight className="text-gray-800 text-xl" />
                    </button>
                    
                    {/* Image Counter - Enhanced */}
                    <div className="absolute bottom-6 right-6 bg-gradient-to-r from-black/80 to-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl text-base font-bold shadow-2xl border-2 border-white/20">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {/* Status Badge - Enhanced */}
                <div className="absolute top-6 left-6">
                  <span className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-base font-black shadow-2xl backdrop-blur-sm border-2 border-white/30 ${
                    listing.condition === 'brand_new' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  }`}>
                    {listing.condition === 'brand_new' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                    <span>{listing.condition === 'brand_new' ? 'Brand New' : 'Second Hand'}</span>
                  </span>
                </div>

                {/* Action Buttons - Enhanced */}
                <div className="absolute top-6 right-6 flex space-x-3">
                  <button
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                    className={`group/btn p-4 rounded-2xl shadow-2xl transition-all transform hover:scale-110 border-2 backdrop-blur-sm ${
                      isFavorite 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-white/30 hover:from-red-600 hover:to-pink-600' 
                        : 'bg-white/95 text-gray-700 hover:bg-white border-white/50'
                    }`}
                  >
                    {isFavorite ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                    {isFavorite && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-4 bg-white/95 backdrop-blur-sm hover:bg-white rounded-2xl shadow-2xl transition-all transform hover:scale-110 border-2 border-white/50"
                  >
                    <FaShareAlt className="text-gray-700 text-xl" />
                  </button>
                  {isOwner && (
                    <Link
                      to={`/listings/${id}/edit`}
                      className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl shadow-2xl transition-all transform hover:scale-110 border-2 border-white/30"
                    >
                      <FaEdit className="text-xl" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery - Premium Design */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mb-8">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`group relative rounded-2xl overflow-hidden transition-all duration-300 transform ${
                      selectedImageIndex === index 
                        ? 'ring-4 ring-blue-500 scale-105 shadow-2xl' 
                        : 'hover:scale-105 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {/* Gradient Border for Selected */}
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl"></div>
                    )}
                    
                    {/* Image Container */}
                    <div className={`relative ${selectedImageIndex === index ? 'p-1' : ''}`}>
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                        className={`w-full h-24 object-cover transition-all duration-300 ${
                          selectedImageIndex === index ? 'rounded-xl' : 'rounded-2xl'
                        } group-hover:brightness-110`}
                      />
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                      
                      {/* Selected Indicator */}
                      {selectedImageIndex === index && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Description Section - Enhanced */}
            <div className="group relative bg-white rounded-3xl shadow-xl p-1 mb-8 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white rounded-3xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <FaMotorcycle className="text-2xl text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">Description</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {listing.description || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Specifications Section - Enhanced */}
            <div className="group relative bg-white rounded-3xl shadow-xl p-1 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white rounded-3xl p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <FaCog className="text-2xl text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">Specifications</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="group/item relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg transform hover:-translate-y-1">
                    <div className="absolute top-3 right-3 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-500 p-2 rounded-xl mr-2">
                        <FaCalendar className="text-white" />
                      </div>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Year</p>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{listing.year}</p>
                  </div>

                  <div className="group/item relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg transform hover:-translate-y-1">
                    <div className="absolute top-3 right-3 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="bg-purple-500 p-2 rounded-xl mr-2">
                        <FaTachometerAlt className="text-white" />
                      </div>
                      <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">Engine</p>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{listing.engine_displacement}cc</p>
                  </div>

                  {listing.mileage && (
                    <div className="group/item relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg transform hover:-translate-y-1">
                      <div className="absolute top-3 right-3 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex items-center mb-3">
                        <div className="bg-green-500 p-2 rounded-xl mr-2">
                          <FaRoad className="text-white" />
                        </div>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Mileage</p>
                      </div>
                      <p className="text-3xl font-black text-gray-900">{listing.mileage.toLocaleString()} km</p>
                    </div>
                  )}

                  {listing.brand && (
                    <div className="group/item relative bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-all hover:shadow-lg transform hover:-translate-y-1">
                      <div className="absolute top-3 right-3 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex items-center mb-3">
                        <div className="bg-orange-500 p-2 rounded-xl mr-2">
                          <FaTag className="text-white" />
                        </div>
                        <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Brand</p>
                      </div>
                      <p className="text-2xl font-black text-gray-900">{listing.brand.name}</p>
                    </div>
                  )}

                  <div className="group/item relative bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-100 hover:border-yellow-300 transition-all hover:shadow-lg transform hover:-translate-y-1">
                    <div className="absolute top-3 right-3 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="bg-yellow-500 p-2 rounded-xl mr-2">
                        <FaEye className="text-white" />
                      </div>
                      <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider">Views</p>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{listing.views || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price & Store Info */}
          <div className="lg:col-span-1">
            {/* Price Card - Enhanced */}
            <div className="group relative bg-white rounded-3xl shadow-2xl p-1 mb-6 sticky top-4 overflow-hidden hover:shadow-3xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white rounded-3xl p-8">
                <div className="mb-8">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-3">Price</p>
                  <p className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    ₱{parseFloat(listing.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  {listing.is_negotiable && (
                    <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200">
                      <FaCheckCircle />
                      <span>Negotiable</span>
                    </span>
                  )}
                </div>

                {/* Contact Buttons - Enhanced */}
                <div className="space-y-3">
                  {/* Chat with Seller Button - Most Prominent */}
                  {!isOwner && (
                    <button
                      onClick={() => {
                        if (!user) {
                          alert('Please login to chat with the seller');
                          navigate('/login');
                          return;
                        }
                        navigate(`/messages?user=${listing.user_id}&listing=${listing.id}`);
                      }}
                      className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-5 rounded-2xl font-black text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
                    >
                      <FaComments className="text-2xl" />
                      <span>Chat with Seller</span>
                    </button>
                  )}
                  
                  {listing.store?.phone && (
                    <a
                      href={`tel:${listing.store.phone}`}
                      className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      <FaPhone className="text-xl" />
                      <span>Call Seller</span>
                    </a>
                  )}
                  {listing.store?.email && (
                    <a
                      href={`mailto:${listing.store.email}`}
                      className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-blue-600 text-blue-600 px-6 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaEnvelope className="text-xl" />
                      <span>Email Seller</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Store Information - Enhanced */}
            {listing.store && (
              <div className="group relative bg-white rounded-3xl shadow-2xl p-1 overflow-hidden hover:shadow-3xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-white rounded-3xl p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaStore className="text-2xl text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Seller Info</h2>
                  </div>
                  
                  {listing.store.logo && (
                    <div className="mb-6">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white ring-2 ring-gray-100">
                        <img
                          src={`http://localhost:8000/storage/${listing.store.logo}`}
                          alt={listing.store.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}

                  <Link 
                    to={`/stores/${listing.store.id}`}
                    className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 mb-6 block transition-all"
                  >
                    {listing.store.name}
                  </Link>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-100">
                      <div className="bg-blue-500 p-2 rounded-xl flex-shrink-0">
                        <FaMapMarkerAlt className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{listing.store.address}</p>
                        <p className="text-sm text-gray-600 font-semibold">{listing.store.city}</p>
                      </div>
                    </div>

                    {listing.store.phone && (
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl border-2 border-gray-100">
                        <div className="bg-green-500 p-2 rounded-xl flex-shrink-0">
                          <FaPhone className="text-white" />
                        </div>
                        <span className="font-bold text-gray-900">{listing.store.phone}</span>
                      </div>
                    )}

                    {listing.store.email && (
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border-2 border-gray-100">
                        <div className="bg-purple-500 p-2 rounded-xl flex-shrink-0">
                          <FaEnvelope className="text-white" />
                        </div>
                        <span className="font-bold text-gray-900 break-all text-sm">{listing.store.email}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/stores/${listing.store.id}`}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaStore className="text-xl" />
                    <span>View Store</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
          >
            <FaTimes size={32} />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-4"
          >
            <FaChevronLeft size={32} />
          </button>
          
          <img
            src={images[selectedImageIndex]}
            alt={listing.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-4"
          >
            <FaChevronRight size={32} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Similar Listings Section */}
      {listing && <SimilarListings currentListingId={listing.id} limit={6} />}
    </div>
  );
};

export default ListingDetails;
