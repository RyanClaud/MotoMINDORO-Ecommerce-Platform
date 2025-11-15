import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { FaMapMarkerAlt, FaCheckCircle, FaCrosshairs, FaArrowLeft } from 'react-icons/fa';

const SuggestLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    shop_type: location.state?.shop_type || 'vulcanizing_shop',
    address: '',
    city: '',
    latitude: location.state?.latitude || '',
    longitude: location.state?.longitude || '',
    phone: '',
    description: '',
    suggested_by_name: '',
    suggested_by_email: '',
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/location-suggestions', formData);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting suggestion');
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your location suggestion has been submitted successfully. Our team will review it and add it to the map soon.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/map')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Back to Map
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  name: '',
                  shop_type: 'vulcanizing_shop',
                  address: '',
                  city: '',
                  latitude: '',
                  longitude: '',
                  phone: '',
                  description: '',
                  suggested_by_name: '',
                  suggested_by_email: '',
                });
              }}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Suggest Another Location
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-semibold"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl">
              <FaMapMarkerAlt className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Suggest a Location</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Help the community by suggesting vulcanizing shops or gas stations in your area
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Your suggestion will be reviewed by our team before being added to the map. We'll notify you via email once it's approved.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
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
          {/* Shop Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type of Location *</label>
            <select
              name="shop_type"
              value={formData.shop_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="vulcanizing_shop">🔧 Vulcanizing Shop</option>
              <option value="gasoline_station">⛽ Gas Station</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Shop/Station Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Quick Fix Vulcanizing or Shell Gas Station"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Street address"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Municipality/City *</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="">Select Municipality/City</option>
              <option value="Calapan City">Calapan City</option>
              <option value="Baco">Baco</option>
              <option value="Bansud">Bansud</option>
              <option value="Bongabong">Bongabong</option>
              <option value="Bulalacao">Bulalacao</option>
              <option value="Gloria">Gloria</option>
              <option value="Mansalay">Mansalay</option>
              <option value="Naujan">Naujan</option>
              <option value="Pinamalayan">Pinamalayan</option>
              <option value="Pola">Pola</option>
              <option value="Puerto Galera">Puerto Galera</option>
              <option value="Roxas">Roxas</option>
              <option value="San Teodoro">San Teodoro</option>
              <option value="Socorro">Socorro</option>
              <option value="Victoria">Victoria</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">Location Coordinates *</label>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="flex items-center space-x-2 text-sm bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-all disabled:opacity-50"
              >
                <FaCrosshairs className={locationLoading ? 'animate-spin' : ''} />
                <span>{locationLoading ? 'Getting Location...' : 'Use My Location'}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required
                placeholder="Latitude"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
                placeholder="Longitude"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <p className="text-xs text-gray-500">
              Click "Use My Location" if you're at the location, or manually enter coordinates
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+63 XXX XXX XXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Information (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional details about this location..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            ></textarea>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Information</h3>
          </div>

          {/* Suggested By Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
            <input
              type="text"
              name="suggested_by_name"
              value={formData.suggested_by_name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Suggested By Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email *</label>
            <input
              type="email"
              name="suggested_by_email"
              value={formData.suggested_by_email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll notify you when your suggestion is approved
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {loading ? 'Submitting...' : 'Submit Suggestion'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuggestLocation;
