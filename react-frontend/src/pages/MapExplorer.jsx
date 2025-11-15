import { useState, useEffect } from 'react';
import api from '../api/axios';
import MapComponent from '../components/MapComponent';
import StoreCard from '../components/StoreCard';
import { FaMapMarkedAlt, FaList, FaSearch, FaFilter } from 'react-icons/fa';

const MapExplorer = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedShopType, setSelectedShopType] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [stores, searchTerm, selectedCity, selectedShopType]);

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores');
      const storesData = response.data.data || response.data;
      setStores(storesData);
      setFilteredStores(storesData);
      
      // Oriental Mindoro Municipalities and Cities
      const orientalMindoroPlaces = [
        'Calapan City',
        'Baco',
        'Bansud',
        'Bongabong',
        'Bulalacao',
        'Gloria',
        'Mansalay',
        'Naujan',
        'Pinamalayan',
        'Pola',
        'Puerto Galera',
        'Roxas',
        'San Teodoro',
        'Socorro',
        'Victoria'
      ];
      
      // Extract unique cities from stores, or use default list
      const uniqueCities = [...new Set(storesData.map(store => store.city))];
      
      // Combine with Oriental Mindoro places and remove duplicates
      const allPlaces = [...new Set([...orientalMindoroPlaces, ...uniqueCities])].sort();
      setCities(allPlaces);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStores = () => {
    let filtered = stores;

    if (searchTerm) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(store => store.city === selectedCity);
    }

    if (selectedShopType) {
      filtered = filtered.filter(store => store.shop_type === selectedShopType);
    }

    setFilteredStores(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCityFilter = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleShopTypeFilter = (e) => {
    setSelectedShopType(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading stores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Background */}
      <div className="relative py-16 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-800/85 to-purple-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-4 animate-fade-in-down">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-2xl">
              <FaMapMarkedAlt className="text-4xl text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-2xl">
              Explore Stores
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl leading-relaxed animate-fade-in-up animation-delay-200">
            Find motorcycle stores across Oriental Mindoro on the interactive map
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and View Toggle */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stores by name or municipality..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCity}
                  onChange={handleCityFilter}
                  className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">All Municipalities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  value={selectedShopType}
                  onChange={handleShopTypeFilter}
                  className="pl-4 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">All Shop Types</option>
                  <option value="motorcycle_shop">🏍️ Motorcycle Shops</option>
                  <option value="vulcanizing_shop">🔧 Vulcanizing Shops</option>
                  <option value="gasoline_station">⛽ Gas Stations</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'map'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaMapMarkedAlt />
                <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaList />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-bold text-blue-600">{filteredStores.length}</span> store{filteredStores.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Map or List View */}
        {viewMode === 'map' ? (
          <div className="h-[600px] mb-8">
            <MapComponent stores={filteredStores} />
            {filteredStores.length === 0 && (
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaMapMarkedAlt className="text-yellow-600 text-2xl mr-3" />
                  <div>
                    <p className="font-semibold text-yellow-800">No stores found matching your filters</p>
                    <p className="text-sm text-yellow-700 mt-1">The map shows Oriental Mindoro. Try adjusting your filters or add new stores.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FaList className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600">No stores found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        )}

        {/* Map Legend */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Map Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-700">🏍️ Motorcycle Shops</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-orange-600 rounded-full"></div>
              <span className="text-sm text-gray-700">🔧 Vulcanizing Shops</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              <span className="text-sm text-gray-700">⛽ Gas Stations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              <span className="text-sm text-gray-700">📍 Your Location</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaMapMarkedAlt className="text-3xl text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Interactive Map</h3>
              <p className="text-gray-600 text-sm">
                Click on markers to view store details and get directions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaSearch className="text-3xl text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Smart Search</h3>
              <p className="text-gray-600 text-sm">
                Filter stores by name, city, or location
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaList className="text-3xl text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Multiple Views</h3>
              <p className="text-gray-600 text-sm">
                Switch between map and list view for better browsing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer;
