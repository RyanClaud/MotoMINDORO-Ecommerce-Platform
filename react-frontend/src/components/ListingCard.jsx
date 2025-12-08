import { Link } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaEye } from 'react-icons/fa';

const ListingCard = ({ listing, onFavorite, isFavorited }) => {
  // Safety check
  if (!listing) {
    return null;
  }

  // Handle different image structures
  let imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
  
  // Check for primary_image (snake_case from API)
  if (listing.primary_image?.image_path) {
    imageUrl = `http://localhost:8000/storage/${listing.primary_image.image_path}`;
  } 
  // Check for primaryImage (camelCase from API)
  else if (listing.primaryImage?.image_path) {
    imageUrl = `http://localhost:8000/storage/${listing.primaryImage.image_path}`;
  } 
  // Fallback to images array
  else if (listing.images && listing.images.length > 0) {
    const firstImage = listing.images.find(img => img.is_primary) || listing.images[0];
    if (firstImage?.image_path) {
      imageUrl = `http://localhost:8000/storage/${firstImage.image_path}`;
    }
  }

  // Handle image load error
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
  };

  return (
    <div className="group relative bg-white rounded-3xl shadow-xl p-1 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Inner Card */}
      <div className="relative bg-white rounded-3xl overflow-hidden">
        <Link to={`/listings/${listing.id}`}>
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={listing.title}
              onError={handleImageError}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
            />
            {/* Enhanced Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Badges Container - Top with proper spacing */}
            <div className="absolute top-3 left-3 right-3 z-10 flex flex-col gap-2">
              {/* Condition Badge */}
              {listing.condition === 'brand_new' ? (
                <div className="self-start bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xl backdrop-blur-sm border-2 border-white/20 flex items-center space-x-1.5 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Brand New</span>
                </div>
              ) : (
                <div className="self-start bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xl backdrop-blur-sm border-2 border-white/20 flex items-center space-x-1.5 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Second Hand</span>
                </div>
              )}
              
              {/* Premium Price Badge */}
              <div className="self-start bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-black shadow-2xl backdrop-blur-sm border-2 border-white/20 group-hover:scale-105 transition-transform duration-300">
                ₱{parseFloat(listing.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Decorative Corner Element */}
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </Link>

        <div className="p-6">
          <Link to={`/listings/${listing.id}`}>
            <h3 className="text-xl font-bold text-gray-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent mb-4 line-clamp-2 transition-all duration-300">
              {listing.title}
            </h3>
          </Link>

          {/* Enhanced Specs Section */}
          <div className="flex items-center text-sm text-gray-600 mb-4 flex-wrap gap-2">
            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-xl font-semibold border border-blue-100 group-hover:scale-105 transition-transform">
              {listing.year}
            </span>
            <span className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-1.5 rounded-xl font-semibold border border-purple-100 group-hover:scale-105 transition-transform">
              {listing.engine_displacement}cc
            </span>
            {listing.mileage && (
              <span className="bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 px-3 py-1.5 rounded-xl font-semibold border border-gray-200 group-hover:scale-105 transition-transform">
                {listing.mileage.toLocaleString()} km
              </span>
            )}
            {listing.condition === 'second_hand' && listing.is_negotiable && (
              <span className="bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 px-3 py-1.5 rounded-xl font-semibold text-xs border border-yellow-200 flex items-center space-x-1 group-hover:scale-105 transition-transform">
                <span>💬</span>
                <span>Negotiable</span>
              </span>
            )}
          </div>

          {/* Location Section */}
          {listing.store && (
            <div className="flex items-center text-sm mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-xl border border-blue-100">
              <div className="bg-blue-500 p-1.5 rounded-lg mr-2">
                <FaMapMarkerAlt className="text-white text-xs" />
              </div>
              <span className="font-semibold text-gray-700">{listing.store.city}</span>
            </div>
          )}

          {/* Footer Section */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
            <div className="flex items-center text-sm bg-gray-50 px-3 py-2 rounded-xl">
              <div className="bg-gray-200 p-1.5 rounded-lg mr-2">
                <FaEye className="text-gray-600 text-xs" />
              </div>
              <span className="font-bold text-gray-700">{listing.views}</span>
              <span className="text-gray-500 ml-1">views</span>
            </div>

            {onFavorite && (
              <button
                onClick={() => onFavorite(listing.id)}
                className={`relative p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                  isFavorited 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-200' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white hover:shadow-lg hover:shadow-red-200'
                }`}
              >
                <FaHeart className="text-lg" />
                {isFavorited && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
