import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  FaStore, FaSearch, FaToggleOn, FaToggleOff, FaMapMarkerAlt,
  FaPhone, FaEnvelope, FaMotorcycle, FaArrowLeft, FaFilter,
  FaGasPump, FaWrench, FaChartLine
} from 'react-icons/fa';

const AdminStores = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [shopTypeFilter, setShopTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchStores();
  }, [user, navigate, search, shopTypeFilter, statusFilter, currentPage]);

  const fetchStores = async () => {
    try {
      const params = {
        search,
        page: currentPage,
        per_page: 15
      };
      
      if (shopTypeFilter !== 'all') params.shop_type = shopTypeFilter;
      if (statusFilter !== 'all') params.is_active = statusFilter === 'active' ? 1 : 0;

      const response = await axios.get('http://localhost:8000/api/admin/stores', {
        withCredentials: true,
        params
      });

      if (response.data.success) {
        setStores(response.data.data.data);
        setTotalPages(response.data.data.last_page);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (storeId) => {
    try {
      // Get CSRF token first
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });

      // Get CSRF token from cookie
      const getCsrfToken = () => {
        const name = 'XSRF-TOKEN=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        
        for (let i = 0; i < cookieArray.length; i++) {
          let cookie = cookieArray[i].trim();
          if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
          }
        }
        return null;
      };

      const csrfToken = getCsrfToken();

      await axios.put(`http://localhost:8000/api/admin/stores/${storeId}/toggle-status`, {}, {
        withCredentials: true,
        headers: {
          'X-XSRF-TOKEN': csrfToken
        }
      });
      
      fetchStores();
    } catch (error) {
      console.error('Error toggling store status:', error);
      alert('Failed to update store status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading stores...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.is_active).length;
  const motorcycleShops = stores.filter(s => s.shop_type === 'motorcycle_shop').length;
  const vulcanizingShops = stores.filter(s => s.shop_type === 'vulcanizing_shop').length;
  const gasolineStations = stores.filter(s => s.shop_type === 'gasoline_station').length;
  const totalListings = stores.reduce((sum, store) => sum + (store.listings_count || 0), 0);

  // Get shop type icon
  const getShopTypeIcon = (shopType) => {
    switch(shopType) {
      case 'motorcycle_shop': return <FaMotorcycle className="text-xl" />;
      case 'vulcanizing_shop': return <FaWrench className="text-xl" />;
      case 'gasoline_station': return <FaGasPump className="text-xl" />;
      default: return <FaStore className="text-xl" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          
          {/* Title Section */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
              <FaStore className="text-4xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Store Management
              </h1>
              <p className="text-gray-600 mt-1">Manage all stores in the system</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Total Stores */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <FaStore className="text-3xl opacity-80" />
                <FaChartLine className="text-2xl opacity-60" />
              </div>
              <p className="text-sm opacity-90 font-medium">Total Stores</p>
              <p className="text-4xl font-bold mt-1">{totalStores}</p>
            </div>

            {/* Active Stores */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <FaToggleOn className="text-3xl text-green-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Active Stores</p>
              <p className="text-4xl font-bold text-green-600 mt-1">{activeStores}</p>
            </div>

            {/* Motorcycle Shops */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <FaMotorcycle className="text-3xl text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Motorcycle Shops</p>
              <p className="text-4xl font-bold text-purple-600 mt-1">{motorcycleShops}</p>
            </div>

            {/* Vulcanizing Shops */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <FaWrench className="text-3xl text-orange-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Vulcanizing</p>
              <p className="text-4xl font-bold text-orange-600 mt-1">{vulcanizingShops}</p>
            </div>

            {/* Gasoline Stations */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <FaGasPump className="text-3xl text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Gas Stations</p>
              <p className="text-4xl font-bold text-blue-600 mt-1">{gasolineStations}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-slide-up">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-400 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search stores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Shop Type Filter */}
            <select
              value={shopTypeFilter}
              onChange={(e) => setShopTypeFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="all">All Shop Types</option>
              <option value="motorcycle_shop">Motorcycle Shop</option>
              <option value="vulcanizing_shop">Vulcanizing Shop</option>
              <option value="gasoline_station">Gasoline Station</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stores.map((store, index) => (
            <div
              key={store.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up border-2 border-gray-100 hover:border-green-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Store Header with Gradient */}
              <div className={`p-6 pb-4 ${
                store.shop_type === 'motorcycle_shop' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                store.shop_type === 'vulcanizing_shop' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                store.shop_type === 'gasoline_station' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                      {getShopTypeIcon(store.shop_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white line-clamp-1">
                        {store.name}
                      </h3>
                      <p className="text-sm text-white text-opacity-90 capitalize mt-1">
                        {store.shop_type?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(store.id)}
                    className={`p-2 rounded-xl transition-all backdrop-blur-sm ${
                      store.is_active
                        ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                        : 'bg-black bg-opacity-20 text-white hover:bg-opacity-30'
                    }`}
                    title={store.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {store.is_active ? <FaToggleOn className="text-2xl" /> : <FaToggleOff className="text-2xl" />}
                  </button>
                </div>
              </div>

              {/* Store Content */}
              <div className="p-6 pt-4">
                {/* Store Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start text-sm text-gray-700">
                    <FaMapMarkerAlt className="mt-1 mr-3 text-green-500 flex-shrink-0" />
                    <span className="font-medium">{store.address}, {store.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <FaPhone className="mr-3 text-blue-500" />
                    <span className="font-medium">{store.phone}</span>
                  </div>
                  {store.email && (
                    <div className="flex items-center text-sm text-gray-700">
                      <FaEnvelope className="mr-3 text-purple-500" />
                      <span className="truncate font-medium">{store.email}</span>
                    </div>
                  )}
                </div>

                {/* Store Stats */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                  <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg">
                    <FaMotorcycle className="text-purple-600" />
                    <span className="font-bold text-gray-900">{store.listings_count || 0}</span>
                    <span className="text-gray-600 text-sm">listings</span>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${
                    store.is_active 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  }`}>
                    {store.is_active ? '✓ Active' : '✗ Inactive'}
                  </span>
                </div>

                {/* Owner Info */}
                <div className="mt-4 pt-4 border-t-2 border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Owner</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{store.user?.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {stores.length === 0 && !loading && (
          <div className="text-center py-12">
            <FaStore className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No stores found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg px-6 py-4 flex items-center justify-between animate-fade-in">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStores;

// Add custom styles for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-up {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  .animate-slide-up {
    animation: slide-up 0.4s ease-out;
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('admin-stores-animations')) {
  style.id = 'admin-stores-animations';
  document.head.appendChild(style);
}
