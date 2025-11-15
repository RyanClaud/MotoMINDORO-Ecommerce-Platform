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
        text: `Check out this ${listing.title} for ₱${listing.price.toLocaleString()}`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const isOwner = user && listing && user.id === listing.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/search" className="hover:text-blue-600">Listings</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{listing?.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-4">
              <img
                src={images[selectedImageIndex]}
                alt={listing.title}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=No+Image'; }}
                className="w-full h-96 lg:h-[500px] object-cover cursor-pointer"
                onClick={() => setShowLightbox(true)}
              />
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <FaChevronLeft className="text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <FaChevronRight className="text-gray-800" />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                  listing.condition === 'brand_new' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {listing.condition === 'brand_new' ? 'Brand New' : 'Second Hand'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className={`p-3 rounded-full shadow-lg transition-all ${
                    isFavorite 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white/90 text-gray-700 hover:bg-white'
                  }`}
                >
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                >
                  <FaShareAlt className="text-gray-700" />
                </button>
                {isOwner && (
                  <Link
                    to={`/listings/${id}/edit`}
                    className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all"
                  >
                    <FaEdit />
                  </Link>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mb-8">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative rounded-lg overflow-hidden transition-all ${
                      selectedImageIndex === index 
                        ? 'ring-4 ring-blue-500 scale-105' 
                        : 'hover:scale-105'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaMotorcycle className="mr-3 text-blue-600" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.description || 'No description available.'}
              </p>
            </div>

            {/* Specifications Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaCog className="mr-3 text-blue-600" />
                Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FaCalendar className="text-blue-600 mr-2" />
                    <p className="text-sm text-gray-600">Year</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{listing.year}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FaTachometerAlt className="text-purple-600 mr-2" />
                    <p className="text-sm text-gray-600">Engine</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{listing.engine_displacement}cc</p>
                </div>

                {listing.mileage && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <FaRoad className="text-green-600 mr-2" />
                      <p className="text-sm text-gray-600">Mileage</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{listing.mileage.toLocaleString()} km</p>
                  </div>
                )}

                {listing.brand && (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <FaTag className="text-orange-600 mr-2" />
                      <p className="text-sm text-gray-600">Brand</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{listing.brand.name}</p>
                  </div>
                )}

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FaEye className="text-yellow-600 mr-2" />
                    <p className="text-sm text-gray-600">Views</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{listing.views || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price & Store Info */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 sticky top-4">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Price</p>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  ₱{listing.price.toLocaleString()}
                </p>
                {listing.is_negotiable && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FaCheckCircle className="mr-1" />
                    Negotiable
                  </span>
                )}
              </div>

              {/* Contact Buttons */}
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
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <FaComments className="text-xl" />
                    <span>Chat with Seller</span>
                  </button>
                )}
                
                {listing.store?.phone && (
                  <a
                    href={`tel:${listing.store.phone}`}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    <FaPhone />
                    <span>Call Seller</span>
                  </a>
                )}
                {listing.store?.email && (
                  <a
                    href={`mailto:${listing.store.email}`}
                    className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all"
                  >
                    <FaEnvelope />
                    <span>Email Seller</span>
                  </a>
                )}
              </div>
            </div>

            {/* Store Information */}
            {listing.store && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaStore className="mr-2 text-blue-600" />
                  Seller Information
                </h2>
                
                {listing.store.logo && (
                  <div className="mb-4">
                    <img
                      src={`http://localhost:8000/storage/${listing.store.logo}`}
                      alt={listing.store.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <Link 
                  to={`/stores/${listing.store.id}`}
                  className="text-xl font-semibold text-blue-600 hover:text-blue-700 mb-4 block"
                >
                  {listing.store.name}
                </Link>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3 text-gray-700">
                    <FaMapMarkerAlt className="mt-1 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{listing.store.address}</p>
                      <p className="text-sm text-gray-600">{listing.store.city}</p>
                    </div>
                  </div>

                  {listing.store.phone && (
                    <div className="flex items-center space-x-3 text-gray-700">
                      <FaPhone className="text-gray-400 flex-shrink-0" />
                      <span>{listing.store.phone}</span>
                    </div>
                  )}

                  {listing.store.email && (
                    <div className="flex items-center space-x-3 text-gray-700">
                      <FaEnvelope className="text-gray-400 flex-shrink-0" />
                      <span className="break-all">{listing.store.email}</span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/stores/${listing.store.id}`}
                  className="mt-6 w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <FaStore />
                  <span>View Store</span>
                </Link>
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
