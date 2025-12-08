import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaStore, 
  FaTachometerAlt, FaCog, FaCalendar, FaRoad, FaCheckCircle,
  FaChevronLeft, FaChevronRight, FaShareAlt, FaComments, FaEye
} from 'react-icons/fa';

const ListingDetailsCompact = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchListing();
    if (user) checkFavoriteStatus();
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
      navigate('/login');
      return;
    }
    try {
      await api.post(`/favorites/${id}`);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listing) {
    return <div className="h-full flex items-center justify-center">Listing not found</div>;
  }

  const images = listing.images || [];
  const currentImage = images[selectedImageIndex]?.image_path 
    ? `http://localhost:8000/storage/${images[selectedImageIndex].image_path}`
    : 'https://via.placeholder.com/800x600?text=No+Image';

  return (
    <div className="compact-page">
      <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left: Image Gallery */}
        <div className="bg-white flex flex-col h-full">
          {/* Main Image - Fixed Height Container */}
          <div className="relative bg-gray-100 flex items-center justify-center overflow-hidden" style={{ height: 'calc(100% - 64px)' }}>
            <img
              src={currentImage}
              alt={listing.title}
              className="w-full h-full object-contain"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${
                listing.condition === 'brand_new' ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                {listing.condition === 'brand_new' ? 'Brand New' : 'Second Hand'}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-1 p-2 bg-white border-t overflow-x-auto" style={{ maxHeight: '60px' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden ${
                    idx === selectedImageIndex ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={`http://localhost:8000/storage/${img.image_path}`}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="bg-white overflow-y-auto h-full">
          <div className="p-3 space-y-3">
            {/* Title & Price */}
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{listing.title}</h1>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-blue-600">
                  ₱{parseFloat(listing.price).toLocaleString()}
                </span>
                {listing.is_negotiable && (
                  <span className="text-xs text-green-600 font-medium">Negotiable</span>
                )}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 p-2 rounded-lg text-center">
                <FaCalendar className="mx-auto text-blue-600 text-sm mb-1" />
                <p className="text-xs text-gray-600">Year</p>
                <p className="font-bold text-sm text-gray-900">{listing.year}</p>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg text-center">
                <FaCog className="mx-auto text-purple-600 text-sm mb-1" />
                <p className="text-xs text-gray-600">Engine</p>
                <p className="font-bold text-sm text-gray-900">{listing.engine_displacement}cc</p>
              </div>
              <div className="bg-orange-50 p-2 rounded-lg text-center">
                <FaRoad className="mx-auto text-orange-600 text-sm mb-1" />
                <p className="text-xs text-gray-600">Mileage</p>
                <p className="font-bold text-sm text-gray-900">{listing.mileage ? `${listing.mileage.toLocaleString()} km` : 'N/A'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  navigate(`/messages?user=${listing.user_id}&listing=${listing.id}`);
                }}
                className="flex items-center justify-center space-x-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-xs font-semibold"
              >
                <FaComments className="text-sm" />
                <span>Chat</span>
              </button>
              {listing.store?.phone && (
                <button
                  onClick={() => window.location.href = `tel:${listing.store.phone}`}
                  className="flex items-center justify-center space-x-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-xs font-semibold"
                >
                  <FaPhone className="text-sm" />
                  <span>Call</span>
                </button>
              )}
              <button
                onClick={toggleFavorite}
                className={`flex items-center justify-center space-x-1 py-2 rounded-lg text-xs font-semibold ${
                  isFavorite ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaHeart className="text-sm" />
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-2 rounded-lg">
              <h3 className="font-bold text-xs mb-1">Description</h3>
              <p className="text-xs text-gray-700 line-clamp-2">{listing.description || 'No description available.'}</p>
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 p-2 rounded-lg">
              <h3 className="font-bold text-xs mb-1">Specifications</h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-semibold">{listing.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-semibold">{listing.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engine:</span>
                  <span className="font-semibold">{listing.engine_displacement}cc</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-semibold capitalize text-xs">{listing.condition?.replace('_', ' ')}</span>
                </div>
                {listing.mileage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-semibold">{listing.mileage.toLocaleString()} km</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-semibold">{listing.stock_quantity || 1}</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {listing.store && (
              <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                <h3 className="font-bold text-xs mb-1 flex items-center">
                  <FaStore className="mr-1 text-blue-600 text-xs" />
                  Seller Information
                </h3>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-gray-900">{listing.store.name}</p>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-1 text-blue-600 text-xs" />
                    <span className="text-xs">{listing.store.city}</span>
                  </div>
                  {listing.store.phone && (
                    <div className="flex items-center text-gray-600">
                      <FaPhone className="mr-1 text-blue-600 text-xs" />
                      <span className="text-xs">{listing.store.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Views */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <div className="flex items-center">
                <FaEye className="mr-1 text-xs" />
                <span>{listing.views || 0} views</span>
              </div>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: listing.title,
                      text: `Check out this ${listing.title}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied!');
                  }
                }}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <FaShareAlt className="mr-1 text-xs" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsCompact;
