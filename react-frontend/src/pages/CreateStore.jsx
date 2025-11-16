import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaCrosshairs, FaMapMarkerAlt, FaStore, FaCheckCircle, FaImage, FaQuestionCircle, FaTimes } from 'react-icons/fa';

const CreateStore = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shop_type: 'motorcycle_shop',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLocationHelp, setShowLocationHelp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/stores', formData);
      
      setSuccess('Store created successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating store');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const getCurrentLocation = () => {
    setLocationLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toFixed(8),
          longitude: position.coords.longitude.toFixed(8),
        });
        setSuccess('Location captured successfully! ✓');
        setTimeout(() => setSuccess(''), 3000);
        setLocationLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLocationLoading(false);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const openInGoogleMaps = () => {
    if (formData.latitude && formData.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${formData.latitude},${formData.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
              <FaStore className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Create New Store</h1>
          </div>
          <p className="text-gray-600 text-lg">Add your motorcycle store to reach more customers</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <FaCheckCircle className="mr-2" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Store Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">Store Information</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Premium Motorcycles LA"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Type *</label>
              <select
                name="shop_type"
                value={formData.shop_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="motorcycle_shop">🏍️ Motorcycle Shop</option>
                <option value="vulcanizing_shop">🔧 Vulcanizing Shop</option>
                <option value="gasoline_station">⛽ Gas Station</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                rows="4"
                placeholder="Tell customers about your store..."
              ></textarea>
            </div>
          </div>

          {/* Auto-Generated Banner Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl flex-shrink-0">
                <FaImage className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">✨ Auto-Generated Store Banner</h3>
                <p className="text-gray-700 mb-3">
                  Your store will automatically get a beautiful, unique banner and logo based on your store name and type. No image upload needed!
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-600" />
                  <span>Unique gradient design</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <FaCheckCircle className="text-green-600" />
                  <span>Professional appearance</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <FaCheckCircle className="text-green-600" />
                  <span>Fast loading & responsive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">Location Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Calapan City"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <input 
                  type="text" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Oriental Mindoro"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                <input 
                  type="text" 
                  name="zip_code" 
                  value={formData.zip_code} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="5200"
                />
              </div>
            </div>

            {/* Geolocation Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center space-x-2">
                      <span>GPS Coordinates *</span>
                      <button
                        type="button"
                        onClick={() => setShowLocationHelp(true)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        title="What are GPS coordinates?"
                      >
                        <FaQuestionCircle className="text-lg" />
                      </button>
                    </h3>
                    <p className="text-sm text-gray-600">Use your current location or enter manually</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {locationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Getting...</span>
                    </>
                  ) : (
                    <>
                      <FaCrosshairs className="text-xl" />
                      <span>Get My Location</span>
                    </>
                  )}
                </button>
              </div>

              {/* Help Text */}
              <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-600">💡 Tip:</span> Click "Get My Location" button above to automatically fill in your coordinates, or{' '}
                  <a 
                    href="https://www.google.com/maps" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    find them on Google Maps
                  </a>
                  {' '}(right-click on your location → click the coordinates to copy).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude *</label>
                  <input 
                    type="number" 
                    step="any" 
                    name="latitude" 
                    value={formData.latitude} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    placeholder="13.4117"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude *</label>
                  <input 
                    type="number" 
                    step="any" 
                    name="longitude" 
                    value={formData.longitude} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    placeholder="121.1803"
                  />
                </div>
              </div>

              {formData.latitude && formData.longitude && (
                <button
                  type="button"
                  onClick={openInGoogleMaps}
                  className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <FaMapMarkerAlt />
                  <span>View on Google Maps</span>
                </button>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="store@example.com"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Creating Store...</span>
                </div>
              ) : (
                'Create Store'
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-2">💡 Tips for accurate location:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Click "Get My Location" to automatically fill coordinates</li>
            <li>• Make sure location services are enabled in your browser</li>
            <li>• You can also get coordinates from Google Maps by right-clicking on your location</li>
            <li>• Accurate coordinates help customers find your store easily</li>
          </ul>
        </div>
      </div>

      {/* Location Help Modal */}
      {showLocationHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-3xl" />
                  <h2 className="text-2xl font-bold">How to Get GPS Coordinates</h2>
                </div>
                <button
                  onClick={() => setShowLocationHelp(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* What are GPS Coordinates */}
              <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">📍 What are GPS Coordinates?</h3>
                <p className="text-gray-700">
                  GPS coordinates are numbers that show the exact location of your store on Earth. They consist of two numbers:
                </p>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold text-blue-600 mr-2">Latitude:</span>
                    <span>How far north or south (e.g., 13.4117)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-blue-600 mr-2">Longitude:</span>
                    <span>How far east or west (e.g., 121.1803)</span>
                  </li>
                </ul>
              </div>

              {/* Method 1: Automatic */}
              <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">✨ Method 1: Automatic (Easiest)</h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold text-green-600 mr-2 min-w-[24px]">1.</span>
                    <span>Click the <span className="font-semibold">"Get My Location"</span> button</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-green-600 mr-2 min-w-[24px]">2.</span>
                    <span>Allow your browser to access your location when prompted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-green-600 mr-2 min-w-[24px]">3.</span>
                    <span>Coordinates will be filled automatically! ✓</span>
                  </li>
                </ol>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">⚠️ Note:</span> Make sure you're physically at your store location when using this method.
                  </p>
                </div>
              </div>

              {/* Method 2: Google Maps */}
              <div className="bg-purple-50 rounded-xl p-5 border-2 border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">🗺️ Method 2: Using Google Maps</h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[24px]">1.</span>
                    <div>
                      <span>Open </span>
                      <a 
                        href="https://www.google.com/maps" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-semibold underline"
                      >
                        Google Maps
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[24px]">2.</span>
                    <span>Search for your store address or zoom to your location</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[24px]">3.</span>
                    <span><span className="font-semibold">Right-click</span> on the exact location of your store</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[24px]">4.</span>
                    <span>Click on the coordinates that appear (they look like: 13.4117, 121.1803)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[24px]">5.</span>
                    <span>The coordinates are now copied! Paste them into the form</span>
                  </li>
                </ol>
                
                {/* Visual Example */}
                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-purple-300">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Example coordinates:</p>
                  <div className="font-mono text-sm bg-gray-100 p-3 rounded-lg">
                    <div className="text-blue-600">Latitude: <span className="text-gray-900">13.4117</span></div>
                    <div className="text-blue-600">Longitude: <span className="text-gray-900">121.1803</span></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    (These are sample coordinates for Calapan City, Oriental Mindoro)
                  </p>
                </div>
              </div>

              {/* Why Important */}
              <div className="bg-orange-50 rounded-xl p-5 border-2 border-orange-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">🎯 Why are coordinates important?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Helps customers find your store easily on the map</li>
                  <li>• Enables accurate navigation and directions</li>
                  <li>• Shows your store in nearby searches</li>
                  <li>• Required for the "Find Nearby Stores" feature</li>
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowLocationHelp(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Got it! Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStore;
