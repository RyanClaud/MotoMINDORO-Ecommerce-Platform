import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar, FaFilter, FaTimes, FaDirections, FaStore, FaWrench, FaCog } from 'react-icons/fa';
import api from '../api/axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EnhancedMapExplorer = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    shopType: 'all',
    minRating: 0,
    openNow: false,
    verified: false,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserLocation();
    fetchStores();
  }, [filters]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Oriental Mindoro
          setUserLocation({ lat: 13.4, lng: 121.4 });
        }
      );
    } else {
      setUserLocation({ lat: 13.4, lng: 121.4 });
    }
  };

  const fetchStores = async () => {
    try {
      const params = {};
      if (filters.shopType !== 'all') params.shop_type = filters.shopType;
      if (filters.minRating > 0) params.min_rating = filters.minRating;
      if (filters.verified) params.verified = true;

      const response = await api.get('/stores/directory', { params });
      setStores(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreClick = (store) => {
    setSelectedStore(store);
  };

  const getDirections = (store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`;
    window.open(url, '_blank');
  };

  const createCustomIcon = (shopType) => {
    const colors = {
      repair_shop: '#3b82f6',
      spare_parts: '#10b981',
      both: '#8b5cf6',
    };

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${colors[shopType] || '#3b82f6'};
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-center;
        ">
          <div style="transform: rotate(45deg); color: white; font-size: 18px;">
            ${shopType === 'repair_shop' ? '🔧' : shopType === 'spare_parts' ? '⚙️' : '🏪'}
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  if (loading || !userLocation) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-2xl shadow-2xl p-6 w-80 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl flex items-center">
              <FaFilter className="mr-2 text-blue-600" />
              Filter Stores
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-4">
            {/* Shop Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shop Type
              </label>
              <select
                value={filters.shopType}
                onChange={(e) => setFilters({ ...filters, shopType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Shops</option>
                <option value="repair_shop">🔧 Repair Shops</option>
                <option value="spare_parts">⚙️ Spare Parts</option>
                <option value="both">🏪 Both</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="0">All Ratings</option>
                <option value="3">⭐ 3+ Stars</option>
                <option value="4">⭐ 4+ Stars</option>
                <option value="4.5">⭐ 4.5+ Stars</option>
              </select>
            </div>

            {/* Verified Filter */}
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
              <input
                type="checkbox"
                id="verified"
                checked={filters.verified}
                onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="verified" className="text-sm font-medium text-gray-700 cursor-pointer">
                Verified Stores Only
              </label>
            </div>

            {/* Results Count */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 flex items-center">
                <FaStore className="mr-2 text-blue-600" />
                Showing <span className="font-bold mx-1">{stores.length}</span> store{stores.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Map Legend</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Repair Shop</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Spare Parts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Both Services</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Filters Button */}
      {!showFilters && (
        <button
          onClick={() => setShowFilters(true)}
          className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-2xl p-4 hover:bg-gray-50 transition-all"
        >
          <FaFilter className="text-blue-600 text-xl" />
        </button>
      )}

      {/* Store Quick Access Panel */}
      {selectedStore && (
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-2xl shadow-2xl p-6 w-96 max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setSelectedStore(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2"
          >
            <FaTimes />
          </button>

          {/* Store Logo/Banner */}
          {selectedStore.logo && (
            <img
              src={`http://localhost:8000/storage/${selectedStore.logo}`}
              alt={selectedStore.name}
              className="w-20 h-20 rounded-xl object-cover mb-4 border-2 border-gray-200"
            />
          )}

          <h3 className="font-bold text-2xl mb-2 pr-8">{selectedStore.name}</h3>

          {/* Shop Type Badge */}
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
            selectedStore.shop_type === 'repair_shop' ? 'bg-blue-100 text-blue-700' :
            selectedStore.shop_type === 'spare_parts' ? 'bg-green-100 text-green-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {selectedStore.shop_type === 'repair_shop' ? '🔧 Repair Shop' :
             selectedStore.shop_type === 'spare_parts' ? '⚙️ Spare Parts' :
             '🏪 Full Service'}
          </span>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-bold text-lg">{selectedStore.rating_average || 0}</span>
            <span className="text-gray-500 text-sm ml-2">
              ({selectedStore.rating_count || 0} reviews)
            </span>
            {selectedStore.verified && (
              <span className="ml-2 text-blue-600 text-sm">✓ Verified</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-3">{selectedStore.description}</p>

          {/* Contact Info */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start text-sm">
              <FaMapMarkerAlt className="mr-3 text-gray-400 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{selectedStore.address}, {selectedStore.city}</span>
            </div>
            <div className="flex items-center text-sm">
              <FaPhone className="mr-3 text-gray-400 flex-shrink-0" />
              <a href={`tel:${selectedStore.phone}`} className="text-blue-600 hover:underline">
                {selectedStore.phone}
              </a>
            </div>
            {selectedStore.email && (
              <div className="flex items-center text-sm">
                <FaEnvelope className="mr-3 text-gray-400 flex-shrink-0" />
                <a href={`mailto:${selectedStore.email}`} className="text-blue-600 hover:underline">
                  {selectedStore.email}
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/store/${selectedStore.slug}`)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              View Store Page
            </button>
            <button
              onClick={() => getDirections(selectedStore)}
              className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center"
            >
              <FaDirections className="mr-2" />
              Get Directions
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: '<div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Store Markers */}
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={[parseFloat(store.latitude), parseFloat(store.longitude)]}
            icon={createCustomIcon(store.shop_type)}
            eventHandlers={{
              click: () => handleStoreClick(store),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h4 className="font-bold text-lg mb-1">{store.name}</h4>
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-400 mr-1 text-sm" />
                  <span className="text-sm font-medium">{store.rating_average || 0}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{store.address}</p>
                <button
                  onClick={() => navigate(`/store/${store.slug}`)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  View Details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default EnhancedMapExplorer;
