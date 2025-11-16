import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  FaPlus, FaStore, FaMotorcycle, FaEye, FaDollarSign, FaEdit, 
  FaTrash, FaCheckCircle, FaTimes, FaBox, FaExclamationTriangle, 
  FaUsers, FaMapMarkerAlt, FaChartBar, FaTrophy, FaFire
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [myStores, setMyStores] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    stock_quantity: 1,
  });

  useEffect(() => {
    // Redirect admins to admin dashboard
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }
    
    if (user?.role === 'seller') {
      fetchMyData();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const fetchMyData = async () => {
    try {
      const [storesRes, listingsRes] = await Promise.all([
        api.get('/my-stores'),
        api.get('/my-listings'),
      ]);
      setMyStores(storesRes.data || []);
      setMyListings(listingsRes.data || []);
      calculateAnalytics(storesRes.data || [], listingsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty data and default analytics on error
      setMyStores([]);
      setMyListings([]);
      setAnalytics({
        totalStores: 0,
        totalListings: 0,
        publishedListings: 0,
        soldListings: 0,
        draftListings: 0,
        lowStockListings: 0,
        outOfStockListings: 0,
        totalViews: 0,
        totalRevenue: 0,
        averagePrice: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (stores, listings) => {
    try {
      const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
      const totalRevenue = listings
        .filter(l => l.status === 'sold')
        .reduce((sum, l) => sum + parseFloat(l.price || 0), 0);
      
      const publishedListings = listings.filter(l => l.status === 'published').length;
      const soldListings = listings.filter(l => l.status === 'sold').length;
      const draftListings = listings.filter(l => l.status === 'draft').length;
      const lowStockListings = listings.filter(l => (l.stock_quantity || 0) > 0 && (l.stock_quantity || 0) <= 3).length;
      const outOfStockListings = listings.filter(l => (l.stock_quantity || 0) === 0).length;

      setAnalytics({
        totalStores: stores.length,
        totalListings: listings.length,
        publishedListings,
        soldListings,
        draftListings,
        lowStockListings,
        outOfStockListings,
        totalViews,
        totalRevenue,
        averagePrice: listings.length > 0 ? listings.reduce((sum, l) => sum + parseFloat(l.price || 0), 0) / listings.length : 0,
      });
    } catch (error) {
      console.error('Error calculating analytics:', error);
      // Set default analytics if calculation fails
      setAnalytics({
        totalStores: stores.length,
        totalListings: listings.length,
        publishedListings: 0,
        soldListings: 0,
        draftListings: 0,
        lowStockListings: 0,
        outOfStockListings: 0,
        totalViews: 0,
        totalRevenue: 0,
        averagePrice: 0,
      });
    }
  };

  const handleSwitchRole = async (newRole) => {
    try {
      await switchRole(newRole);
      if (newRole === 'seller') {
        fetchMyData();
      }
    } catch (error) {
      console.error('Error switching role:', error);
    }
  };

  const handleEditClick = (listing) => {
    setSelectedListing(listing);
    setEditForm({
      status: listing.status,
      stock_quantity: listing.stock_quantity || 1,
    });
    setShowEditModal(true);
  };

  const handleUpdateListing = async () => {
    try {
      await api.put(`/listings/${selectedListing.id}`, editForm);
      setShowEditModal(false);
      fetchMyData();
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Failed to update listing');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await api.delete(`/listings/${id}`);
      fetchMyData();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header with Gradient Background */}
        <div className="mb-8 relative overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          
          {/* Content */}
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
                  Dashboard
                </h1>
                <p className="text-xl text-white/90">
                  Welcome back, <span className="font-black text-white">{user?.name}</span>! 👋
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <p className="text-sm text-white/70 font-semibold">Account Type</p>
                  <p className="text-2xl font-black text-white capitalize">{user?.role}</p>
                </div>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/30">
                  <span className="text-4xl text-white font-black">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards - For All Users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* My Stores Card */}
          <Link to="/stores/create" className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <FaStore className="text-4xl text-white" />
                </div>
                <span className="text-6xl font-black text-white">{myStores.length || 0}</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">My Stores</h3>
              <p className="text-white/80 text-sm font-medium">View Stores →</p>
            </div>
          </Link>

          {/* My Listings Card */}
          <Link to="/listings/create" className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <FaMotorcycle className="text-4xl text-white" />
                </div>
                <span className="text-6xl font-black text-white">{myListings.length || 0}</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">My Listings</h3>
              <p className="text-white/80 text-sm font-medium">View Listings →</p>
            </div>
          </Link>

          {/* Favorites Card */}
          <Link to="/favorites" className="group relative overflow-hidden bg-gradient-to-br from-pink-500 to-red-500 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <FaUsers className="text-4xl text-white" />
                </div>
                <span className="text-6xl font-black text-white">0</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Favorites</h3>
              <p className="text-white/80 text-sm font-medium">View Favorites →</p>
            </div>
          </Link>
        </div>

        {/* Buyer Dashboard Content - Moved Up */}
        {user?.role === 'buyer' && (
          <div className="space-y-8 mb-8">
            {/* Premium Welcome Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative z-10 text-center text-white">
                <div className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-6">
                  <FaUsers className="text-6xl" />
                </div>
                <h2 className="text-4xl font-black mb-4">Buyer Dashboard</h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Discover your dream motorcycle, save favorites, and connect with trusted sellers across Oriental Mindoro
                </p>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Browse Motorcycles */}
              <Link
                to="/search"
                className="group relative bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FaMotorcycle className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Browse Motorcycles</h3>
                  <p className="text-gray-600 mb-4">
                    Explore thousands of motorcycles from verified sellers
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Start Browsing</span>
                    <FaFire className="ml-2" />
                  </div>
                </div>
              </Link>

              {/* View Favorites */}
              <Link
                to="/favorites"
                className="group relative bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-pink-600 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FaUsers className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">My Favorites</h3>
                  <p className="text-gray-600 mb-4">
                    View and manage your saved motorcycles
                  </p>
                  <div className="flex items-center text-pink-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>View Collection</span>
                    <FaTrophy className="ml-2" />
                  </div>
                </div>
              </Link>

              {/* Explore Map */}
              <Link
                to="/map"
                className="group relative bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FaStore className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Explore Map</h3>
                  <p className="text-gray-600 mb-4">
                    Find nearby stores and dealerships on the map
                  </p>
                  <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Open Map</span>
                    <FaChartBar className="ml-2" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaTrophy className="mr-3 text-yellow-500" />
                Why Choose MotoMINDORO?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                    <FaCheckCircle className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Verified Sellers</h4>
                    <p className="text-gray-600 text-sm">All sellers are verified for your safety and peace of mind</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                    <FaStore className="text-2xl text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Local Dealerships</h4>
                    <p className="text-gray-600 text-sm">Connect with trusted local motorcycle shops in Oriental Mindoro</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                    <FaMotorcycle className="text-2xl text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Wide Selection</h4>
                    <p className="text-gray-600 text-sm">Browse from hundreds of motorcycles in various brands and models</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-xl flex-shrink-0">
                    <FaDollarSign className="text-2xl text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Best Prices</h4>
                    <p className="text-gray-600 text-sm">Compare prices and find the best deals in your area</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compact Role Switcher - Moved Down & Made Smaller */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-700">Switch Mode</h2>
            <span className="text-xs text-gray-500">Choose your experience</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSwitchRole('buyer')}
              className={`group relative overflow-hidden px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                user?.role === 'buyer'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:shadow-md'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <FaUsers className="text-lg" />
                <span>Buyer</span>
                {user?.role === 'buyer' && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">Active</span>
                )}
              </div>
            </button>
            <button
              onClick={() => handleSwitchRole('seller')}
              className={`group relative overflow-hidden px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                user?.role === 'seller' || user?.role === 'admin'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:shadow-md'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <FaStore className="text-lg" />
                <span>Seller</span>
                {(user?.role === 'seller' || user?.role === 'admin') && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">Active</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {(user?.role === 'seller' || user?.role === 'admin') && analytics && (
          <>
            {/* Modern Analytics Cards with Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Stores */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaStore className="text-3xl text-white" />
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-black text-gray-900">{analytics.totalStores}</span>
                      <div className="flex items-center justify-end text-green-600 text-sm font-semibold mt-1">
                        <FaChartBar className="mr-1" />
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-gray-600 font-bold text-lg">Total Stores</h3>
                </div>
              </div>

              {/* Total Listings */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaMotorcycle className="text-3xl text-white" />
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-black text-gray-900">{analytics.totalListings}</span>
                      <div className="flex items-center justify-end text-blue-600 text-sm font-semibold mt-1">
                        <FaTrophy className="mr-1" />
                        <span>Listed</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-gray-600 font-bold text-lg">Total Listings</h3>
                </div>
              </div>

              {/* Total Views */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaEye className="text-3xl text-white" />
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-black text-gray-900">{analytics.totalViews}</span>
                      <div className="flex items-center justify-end text-purple-600 text-sm font-semibold mt-1">
                        <FaFire className="mr-1" />
                        <span>Views</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-gray-600 font-bold text-lg">Total Views</h3>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaDollarSign className="text-3xl text-white" />
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-black text-gray-900">₱{(analytics.totalRevenue / 1000).toFixed(0)}K</span>
                      <div className="flex items-center justify-end text-green-600 text-sm font-semibold mt-1">
                        <FaDollarSign className="mr-1" />
                        <span>Revenue</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-gray-600 font-bold text-lg">Total Revenue</h3>
                </div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <FaCheckCircle className="text-2xl text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">{analytics.publishedListings}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2 font-medium">Published</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <FaBox className="text-2xl text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">{analytics.soldListings}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2 font-medium">Sold</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <FaEdit className="text-2xl text-gray-600" />
                  <span className="text-2xl font-bold text-gray-900">{analytics.draftListings}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2 font-medium">Draft</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
                <div className="flex items-center justify-between">
                  <FaExclamationTriangle className="text-2xl text-yellow-600" />
                  <span className="text-2xl font-bold text-gray-900">{analytics.lowStockListings}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2 font-medium">Low Stock</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-200">
                <div className="flex items-center justify-between">
                  <FaTimes className="text-2xl text-red-600" />
                  <span className="text-2xl font-bold text-gray-900">{analytics.outOfStockListings}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2 font-medium">Out of Stock</p>
              </div>
            </div>

            {/* My Stores Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaStore className="mr-3 text-blue-600" />
                  My Stores
                </h2>
                <Link
                  to="/stores/create"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <FaPlus />
                  <span>Add Store</span>
                </Link>
              </div>

              {myStores.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FaStore className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-6 text-lg">You haven't created any stores yet.</p>
                  <Link
                    to="/stores/create"
                    className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    Create Your First Store
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myStores.map((store) => (
                    <div key={store.id} className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100">
                      {/* Banner with Gradient Overlay */}
                      <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                        {store.banner ? (
                          <>
                            <img src={`http://localhost:8000/storage/${store.banner}`} alt={store.name} className="w-full h-full object-cover opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FaStore className="text-6xl text-white/30" />
                          </div>
                        )}
                        {/* Logo Overlay */}
                        {store.logo && (
                          <div className="absolute -bottom-8 left-6">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white">
                              <img src={`http://localhost:8000/storage/${store.logo}`} alt={store.name} className="w-full h-full object-cover" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 pt-12">
                        <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{store.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {store.city}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-100">
                          <div className="flex items-center space-x-2">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              <FaMotorcycle className="text-purple-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">{store.listings?.length || 0}</p>
                              <p className="text-xs text-gray-500">Listings</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <FaEye className="text-green-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">0</p>
                              <p className="text-xs text-gray-500">Views</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Link
                          to={`/stores/${store.id}`}
                          className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          View Store →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Listings Section with CRUD */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 flex items-center">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl mr-3">
                      <FaMotorcycle className="text-2xl text-white" />
                    </div>
                    My Listings
                  </h2>
                  <p className="text-gray-600 mt-2 ml-14">Manage your motorcycle listings</p>
                </div>
                <Link
                  to="/listings/create"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaPlus className="text-lg" />
                  <span>Add Listing</span>
                </Link>
              </div>

              {myListings.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FaMotorcycle className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-6 text-lg">You haven't created any listings yet.</p>
                  <Link
                    to="/listings/create"
                    className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    Create Your First Listing
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-6 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Motorcycle</th>
                          <th className="px-6 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Views</th>
                          <th className="px-6 py-5 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {myListings.map((listing) => (
                          <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                  {listing.primary_image?.image_path || listing.primaryImage?.image_path ? (
                                    <img
                                      src={`http://localhost:8000/storage/${listing.primary_image?.image_path || listing.primaryImage?.image_path}`}
                                      alt={listing.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=No+Image'; }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <FaMotorcycle className="text-2xl text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <Link to={`/listings/${listing.id}`} className="font-semibold text-gray-900 hover:text-blue-600">
                                    {listing.title}
                                  </Link>
                                  <p className="text-sm text-gray-600">{listing.year} • {listing.engine_displacement}cc</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-blue-600">₱{listing.price.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                listing.status === 'published' ? 'bg-green-100 text-green-800' :
                                listing.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-semibold ${
                                (listing.stock_quantity || 0) === 0 ? 'text-red-600' :
                                (listing.stock_quantity || 0) <= 3 ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {listing.stock_quantity || 0} units
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-600">{listing.views || 0}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditClick(listing)}
                                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                                  title="Edit Status & Stock"
                                >
                                  <FaEdit />
                                </button>
                                <Link
                                  to={`/listings/${listing.id}/edit`}
                                  className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all"
                                  title="Edit Full Details"
                                >
                                  <FaMotorcycle />
                                </Link>
                                <button
                                  onClick={() => handleDeleteListing(listing.id)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}


      </div>

      {/* Edit Modal */}
      {showEditModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Update Listing Status</h3>
            
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.stock_quantity}
                  onChange={(e) => setEditForm({ ...editForm, stock_quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 for out of stock</p>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleUpdateListing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
