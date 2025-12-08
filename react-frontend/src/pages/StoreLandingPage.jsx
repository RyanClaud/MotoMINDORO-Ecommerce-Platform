import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, 
  FaFacebook, FaInstagram, FaWhatsapp, FaGlobe, FaCheckCircle,
  FaWrench, FaCog, FaStore, FaDirections, FaHeart
} from 'react-icons/fa';
import api from '../api/axios';

const StoreLandingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchStoreData();
  }, [slug]);

  const fetchStoreData = async () => {
    try {
      const response = await api.get(`/stores/${slug}/page`);
      setStore(response.data);

      // Track visit
      await api.post(`/stores/${response.data.id}/visit`).catch(() => {});
    } catch (error) {
      console.error('Error fetching store:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
          <p className="text-gray-600 mb-4">The store you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/stores')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Stores
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        {store.banner && (
          <img
            src={`http://localhost:8000/storage/${store.banner}`}
            alt={store.name}
            className="w-full h-full object-cover opacity-40"
          />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            {store.logo && (
              <img
                src={`http://localhost:8000/storage/${store.logo}`}
                alt={store.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-2xl object-cover bg-white"
              />
            )}
            <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">{store.name}</h1>
            
            {/* Shop Type Badge */}
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
              store.shop_type === 'repair_shop' ? 'bg-blue-500' :
              store.shop_type === 'spare_parts' ? 'bg-green-500' :
              'bg-purple-500'
            }`}>
              {store.shop_type === 'repair_shop' && '🔧 Repair Shop'}
              {store.shop_type === 'spare_parts' && '⚙️ Spare Parts Store'}
              {store.shop_type === 'both' && '🏪 Full Service Center'}
            </span>

            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-2 text-xl" />
                <span className="text-2xl font-bold">{store.rating_average || 0}</span>
                <span className="ml-2 text-lg">({store.rating_count || 0} reviews)</span>
              </div>
              {store.verified && (
                <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                  <FaCheckCircle className="mr-2" />
                  <span className="font-semibold">Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-200">
                {['about', 'services', 'parts', 'gallery'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 font-semibold capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* About Tab */}
                {activeTab === 'about' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About Us</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {store.description || 'No description available.'}
                    </p>

                    {/* Features */}
                    {store.features && store.features.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-xl font-bold mb-3">Features & Amenities</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {store.features.map((feature) => (
                            <div key={feature.id} className="flex items-center space-x-2 text-gray-700">
                              <FaCheckCircle className="text-green-500" />
                              <span>{feature.feature_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Our Services</h2>
                    {store.services && store.services.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {store.services.map((service) => (
                          <div key={service.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-all">
                            <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                            {service.price_range && (
                              <p className="text-blue-600 font-semibold">{service.price_range}</p>
                            )}
                            {service.duration && (
                              <p className="text-gray-500 text-sm mt-1">Duration: {service.duration}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No services listed yet.</p>
                    )}
                  </div>
                )}

                {/* Spare Parts Tab */}
                {activeTab === 'parts' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Available Spare Parts</h2>
                    {store.spare_parts && store.spare_parts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {store.spare_parts.map((part) => (
                          <div key={part.id} className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                            {part.images && part.images[0] && (
                              <img
                                src={`http://localhost:8000/storage/${part.images[0]}`}
                                alt={part.name}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
                            )}
                            <h3 className="font-bold mb-1">{part.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{part.brand}</p>
                            <p className="text-blue-600 font-bold text-lg">₱{parseFloat(part.price).toLocaleString()}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Stock: {part.stock_quantity > 0 ? part.stock_quantity : 'Out of stock'}
                            </p>
                            {part.condition && (
                              <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full capitalize">
                                {part.condition}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No spare parts listed yet.</p>
                    )}
                  </div>
                )}

                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                    {store.images && store.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {store.images.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={`http://localhost:8000/storage/${image.image_path}`}
                              alt={image.title || 'Store image'}
                              className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all"
                            />
                            {image.title && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
                                <p className="text-sm font-medium">{image.title}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No images available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Listings */}
            {store.listings && store.listings.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Featured Motorcycles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {store.listings.slice(0, 4).map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => navigate(`/listings/${listing.id}`)}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-all"
                    >
                      <h3 className="font-bold">{listing.title}</h3>
                      <p className="text-blue-600 font-bold text-lg">₱{parseFloat(listing.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="font-bold text-xl mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">{store.address}, {store.city}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-3 text-blue-600 flex-shrink-0" />
                  <a href={`tel:${store.phone}`} className="text-gray-700 hover:text-blue-600">
                    {store.phone}
                  </a>
                </div>
                {store.whatsapp && (
                  <div className="flex items-center">
                    <FaWhatsapp className="mr-3 text-green-600 flex-shrink-0" />
                    <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600">
                      WhatsApp
                    </a>
                  </div>
                )}
                {store.email && (
                  <div className="flex items-center">
                    <FaEnvelope className="mr-3 text-blue-600 flex-shrink-0" />
                    <a href={`mailto:${store.email}`} className="text-gray-700 hover:text-blue-600 break-all">
                      {store.email}
                    </a>
                  </div>
                )}
                {store.website && (
                  <div className="flex items-center">
                    <FaGlobe className="mr-3 text-blue-600 flex-shrink-0" />
                    <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {(store.facebook || store.instagram) && (
                <div className="flex space-x-4 mt-6 pt-6 border-t border-gray-200">
                  {store.facebook && (
                    <a href={store.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-2xl hover:text-blue-700">
                      <FaFacebook />
                    </a>
                  )}
                  {store.instagram && (
                    <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-2xl hover:text-pink-700">
                      <FaInstagram />
                    </a>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <button
                  onClick={getDirections}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center"
                >
                  <FaDirections className="mr-2" />
                  Get Directions
                </button>
                <button
                  onClick={() => navigate(`/messages?user=${store.user_id}`)}
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all"
                >
                  Send Message
                </button>
              </div>
            </div>

            {/* Operating Hours */}
            {store.operating_hours && store.operating_hours.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center">
                  <FaClock className="mr-2 text-blue-600" />
                  Operating Hours
                </h3>
                <div className="space-y-2">
                  {store.operating_hours.map((hours) => (
                    <div key={hours.id} className="flex justify-between text-sm">
                      <span className="capitalize font-medium text-gray-700">{hours.day_of_week}</span>
                      <span className="text-gray-600">
                        {hours.is_open ? `${hours.open_time} - ${hours.close_time}` : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLandingPage;
