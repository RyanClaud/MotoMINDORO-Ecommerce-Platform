import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ListingCard from '../components/ListingCard';
import MapComponent from '../components/MapComponent';
import generateStoreBanner from '../utils/generateStoreBanner';
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaStar, FaArrowLeft,
  FaMotorcycle, FaCheckCircle, FaEdit, FaShareAlt, FaDirections,
  FaStore, FaCalendar, FaGlobe, FaHeart, FaRegStar
} from 'react-icons/fa';

const StoreDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    fetchStore();
  }, [id]);

  const fetchStore = async () => {
    try {
      const response = await api.get(`/stores/${id}`);
      setStore(response.data.store);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `Check out ${store.name}`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const calculateAverageRating = () => {
    if (!store.reviews || store.reviews.length === 0) return 0;
    const sum = store.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / store.reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading store...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Store not found</h2>
        <Link to="/map" className="text-blue-600 hover:text-blue-700 font-semibold">
          ← Back to Map
        </Link>
      </div>
    );
  }

  const isOwner = user && store && user.id === store.user_id;
  const averageRating = calculateAverageRating();
  const bannerData = generateStoreBanner(store.name, store.shop_type);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Auto-Generated Banner Section */}
      <div className="relative h-80 overflow-hidden">
        {/* Gradient Background */}
        <div className={`w-full h-full bg-gradient-to-br ${bannerData.gradient} relative`}>
          {/* Animated Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          {/* Large Icon Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="text-white text-9xl transform rotate-12">
              {bannerData.icon}
            </div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
          
          {/* Store Name Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="text-7xl mb-4 animate-bounce-in">{bannerData.icon}</div>
              <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-2xl mb-2 animate-fade-in">
                {store.name}
              </h1>
              <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 animate-fade-in-up animation-delay-200">
                <p className="text-white font-semibold text-lg">
                  {store.shop_type === 'motorcycle_shop' ? '🏍️ Motorcycle Shop' :
                   store.shop_type === 'vulcanizing_shop' ? '🔧 Vulcanizing Shop' :
                   '⛽ Gas Station'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner Overlay Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <Link 
              to="/map" 
              className="inline-flex items-center text-white hover:text-gray-200 mb-4 font-semibold bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm transition-all"
            >
              <FaArrowLeft className="mr-2" />
              Back to Map
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleShare}
            className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all backdrop-blur-sm"
          >
            <FaShareAlt className="text-gray-700" />
          </button>
          {isOwner && (
            <button
              onClick={() => navigate(`/stores/${id}/edit`)}
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all"
            >
              <FaEdit />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Store Header Card */}
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Auto-Generated Logo */}
                <div className="flex-shrink-0">
                  <div className={`w-32 h-32 bg-gradient-to-br ${bannerData.gradient} rounded-2xl shadow-lg ring-4 ring-white flex items-center justify-center transform hover:scale-105 transition-transform`}>
                    <div className="text-center">
                      <div className="text-5xl mb-2">{bannerData.icon}</div>
                      <div className="text-sm font-bold text-white opacity-90">{bannerData.initials}</div>
                    </div>
                  </div>
                </div>
                
                {/* Store Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">{store.name}</h1>
                      {store.is_active && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <FaCheckCircle className="mr-1" />
                          Active Store
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Rating */}
                  {store.reviews && store.reviews.length > 0 && (
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`${
                              star <= Math.round(averageRating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            } text-xl`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-lg font-semibold text-gray-900">
                        {averageRating}
                      </span>
                      <span className="ml-1 text-gray-600">
                        ({store.reviews.length} {store.reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}

                  {store.description && (
                    <p className="text-gray-700 mb-6 leading-relaxed">{store.description}</p>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <FaMotorcycle className="text-2xl text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {store.listings?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600">Motorcycles</p>
                    </div>

                    {store.reviews && store.reviews.length > 0 && (
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <FaStar className="text-2xl text-yellow-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
                        <p className="text-sm text-gray-600">Rating</p>
                      </div>
                    )}

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <FaCheckCircle className="text-2xl text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {store.is_active ? 'Open' : 'Closed'}
                      </p>
                      <p className="text-sm text-gray-600">Status</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <FaCalendar className="text-2xl text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {new Date(store.created_at).getFullYear()}
                      </p>
                      <p className="text-sm text-gray-600">Since</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Bar */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaMapMarkerAlt className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {store.city}, {store.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaPhone className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a 
                      href={`tel:${store.phone}`}
                      className="font-semibold text-gray-900 text-sm hover:text-blue-600"
                    >
                      {store.phone}
                    </a>
                  </div>
                </div>

                {store.email && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <FaEnvelope className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a 
                        href={`mailto:${store.email}`}
                        className="font-semibold text-gray-900 text-sm hover:text-blue-600 break-all"
                      >
                        {store.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('listings')}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'listings'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaMotorcycle />
                <span>Motorcycles ({store.listings?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'about'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaStore />
                <span>About</span>
              </button>
              {store.reviews && store.reviews.length > 0 && (
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'reviews'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FaStar />
                  <span>Reviews ({store.reviews.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaMotorcycle className="mr-3 text-blue-600" />
                  Available Motorcycles
                </h2>
                {store.listings && store.listings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {store.listings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <FaMotorcycle className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No motorcycles available at this store yet.</p>
                    {isOwner && (
                      <Link
                        to="/listings/create"
                        className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                      >
                        Add Your First Listing
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaStore className="mr-3 text-blue-600" />
                    About This Store
                  </h2>
                  
                  {store.description ? (
                    <p className="text-gray-700 leading-relaxed mb-6">{store.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">No description available.</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Full Address</p>
                      <p className="font-semibold text-gray-900">
                        {store.address}, {store.city}, {store.state} {store.zip_code}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Contact Number</p>
                      <p className="font-semibold text-gray-900">{store.phone}</p>
                    </div>

                    {store.email && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">Email Address</p>
                        <p className="font-semibold text-gray-900 break-all">{store.email}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Member Since</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(store.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                {store.business_hours && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <FaClock className="mr-2 text-blue-600" />
                      Business Hours
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(store.business_hours).map(([day, hours]) => (
                        <div 
                          key={day} 
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="font-semibold capitalize text-gray-900">{day}</span>
                          <span className="text-gray-700">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && store.reviews && store.reviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaStar className="mr-3 text-yellow-500" />
                  Customer Reviews
                </h2>
                
                <div className="space-y-6">
                  {store.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`text-sm ${
                                    star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                Location
              </h3>
              <div className="h-64 rounded-xl overflow-hidden mb-4 border-2 border-gray-100">
                <MapComponent 
                  stores={[store]} 
                  center={[parseFloat(store.latitude), parseFloat(store.longitude)]}
                  zoom={15}
                />
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                <FaDirections />
                <span>Get Directions</span>
              </a>
            </div>

            {/* Quick Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <FaPhone />
                  <span>Call Now</span>
                </a>
                {store.email && (
                  <a
                    href={`mailto:${store.email}`}
                    className="flex items-center justify-center space-x-2 w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all"
                  >
                    <FaEnvelope />
                    <span>Send Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Store Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Store Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Total Listings</span>
                  <span className="text-2xl font-bold">{store.listings?.length || 0}</span>
                </div>
                {store.reviews && store.reviews.length > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Average Rating</span>
                      <span className="text-2xl font-bold">{averageRating} ⭐</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Total Reviews</span>
                      <span className="text-2xl font-bold">{store.reviews.length}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Status</span>
                  <span className="text-lg font-bold">
                    {store.is_active ? '✓ Active' : '✗ Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
