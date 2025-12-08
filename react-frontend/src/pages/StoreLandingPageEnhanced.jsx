import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaStar,
  FaFacebook, FaInstagram, FaGlobe, FaMotorcycle, FaTools,
  FaBox, FaImages, FaHeart, FaShare, FaDirections, FaEye
} from 'react-icons/fa';

const StoreLandingPageEnhanced = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchStoreLanding();
  }, [slug]);

  const fetchStoreLanding = async () => {
    try {
      const response = await api.get(`/store-landing/${slug}`);
      setStore(response.data.store);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching store:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="compact-page flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="compact-page flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
          <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const images = store.images || [];
  const currentImage = images[selectedImage]?.image_path
    ? `http://localhost:8000/storage/${images[selectedImage].image_path}`
    : store.banner
    ? `http://localhost:8000/storage/${store.banner}`
    : 'https://via.placeholder.com/1200x400?text=Store+Banner';

  return (
    <div className="compact-page overflow-y-auto bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-600">
        <img
          src={currentImage}
          alt={store.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Store Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto flex items-end justify-between">
            <div className="flex items-end space-x-4">
              {store.logo && (
                <img
                  src={`http://localhost:8000/storage/${store.logo}`}
                  alt={store.name}
                  className="w-24 h-24 rounded-xl border-4 border-white shadow-2xl object-cover bg-white"
                />
              )}
              <div>
                <h1 className="text-3xl font-black mb-1">{store.name}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-bold">{stats?.average_rating?.toFixed(1) || 'N/A'}</span>
                    <span className="ml-1">({stats?.total_reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <FaEye className="mr-1" />
                    <span>{stats?.total_views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-xl transition">
                <FaHeart className="text-xl" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-xl transition">
                <FaShare className="text-xl" />
              </button>
              <button
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition"
              >
                <FaDirections />
                <span>Get Directions</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {['overview', 'motorcycles', 'spare-parts', 'services', 'gallery', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold capitalize transition border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">{store.description || 'No description available.'}</p>
                  
                  {store.specialties && (
                    <div className="mt-4">
                      <h3 className="font-bold text-lg mb-2">Specialties</h3>
                      <p className="text-gray-700">{store.specialties}</p>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 text-center border-2 border-blue-100">
                    <FaMotorcycle className="text-4xl text-blue-600 mx-auto mb-2" />
                    <p className="text-3xl font-black text-gray-900">{stats?.total_listings || 0}</p>
                    <p className="text-sm text-gray-600">Motorcycles</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 text-center border-2 border-green-100">
                    <FaBox className="text-4xl text-green-600 mx-auto mb-2" />
                    <p className="text-3xl font-black text-gray-900">{stats?.total_spare_parts || 0}</p>
                    <p className="text-sm text-gray-600">Spare Parts</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6 text-center border-2 border-purple-100">
                    <FaTools className="text-4xl text-purple-600 mx-auto mb-2" />
                    <p className="text-3xl font-black text-gray-900">{stats?.total_services || 0}</p>
                    <p className="text-sm text-gray-600">Services</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'motorcycles' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Available Motorcycles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {store.listings?.map((listing) => (
                    <Link
                      key={listing.id}
                      to={`/listings/${listing.id}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
                    >
                      <img
                        src={listing.images?.[0]?.image_path
                          ? `http://localhost:8000/storage/${listing.images[0].image_path}`
                          : 'https://via.placeholder.com/400x300'}
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{listing.title}</h3>
                        <p className="text-2xl font-black text-blue-600">
                          ₱{parseFloat(listing.price).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'spare-parts' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Spare Parts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {store.spare_parts?.map((part) => (
                    <div key={part.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-bold mb-2">{part.name}</h3>
                      <p className="text-lg font-black text-green-600">₱{parseFloat(part.price).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Stock: {part.stock_quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Services Offered</h2>
                <div className="space-y-3">
                  {store.services?.map((service) => (
                    <div key={service.id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{service.name}</h3>
                          <p className="text-gray-600 mt-1">{service.description}</p>
                        </div>
                        {service.price && (
                          <p className="text-xl font-black text-blue-600">₱{parseFloat(service.price).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className="aspect-square rounded-xl overflow-hidden hover:scale-105 transition"
                    >
                      <img
                        src={`http://localhost:8000/storage/${img.image_path}`}
                        alt={img.caption || `Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <div className="space-y-4">
                  {store.reviews?.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {review.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold">{review.user?.name || 'Anonymous'}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-sm text-gray-600">{store.address}</p>
                    <p className="text-sm text-gray-600">{store.city}</p>
                  </div>
                </div>
                
                {store.phone && (
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-green-600" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <a href={`tel:${store.phone}`} className="text-sm text-blue-600 hover:underline">
                        {store.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {store.email && (
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-purple-600" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <a href={`mailto:${store.email}`} className="text-sm text-blue-600 hover:underline break-all">
                        {store.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="pt-4 border-t">
                  <p className="font-semibold mb-2">Follow Us</p>
                  <div className="flex space-x-3">
                    {store.facebook && (
                      <a href={store.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        <FaFacebook className="text-2xl" />
                      </a>
                    )}
                    {store.instagram && (
                      <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                        <FaInstagram className="text-2xl" />
                      </a>
                    )}
                    {store.website && (
                      <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700">
                        <FaGlobe className="text-2xl" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Operating Hours */}
                {store.operating_hours && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaClock className="text-orange-600" />
                      <p className="font-semibold">Operating Hours</p>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {Object.entries(store.operating_hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize">{day}:</span>
                          <span className="font-medium">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLandingPageEnhanced;
