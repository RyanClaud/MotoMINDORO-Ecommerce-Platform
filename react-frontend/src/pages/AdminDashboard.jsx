import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  FaUsers, FaStore, FaMotorcycle, FaChartLine,
  FaUserPlus, FaShoppingBag, FaEye, FaCheckCircle,
  FaChartBar, FaArrowUp, FaArrowDown
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/analytics', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load analytics</p>
      </div>
    );
  }

  const { totals, recent_activity, user_growth, listings_by_status, top_stores, most_viewed_listings } = analytics;

  // Calculate percentages for progress bars
  const buyerPercentage = totals.users > 0 ? (totals.buyers / totals.users) * 100 : 0;
  const sellerPercentage = totals.users > 0 ? (totals.sellers / totals.users) * 100 : 0;
  const publishedPercentage = totals.listings > 0 ? (totals.published_listings / totals.listings) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Real-time system monitoring
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="text-lg font-bold text-gray-900">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Pending Stores Notification Banner */}
        {totals.pending_stores > 0 && (
          <div className="mb-6 animate-slide-up">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl shadow-2xl p-1">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-xl animate-pulse">
                        <FaStore className="text-3xl text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center animate-bounce">
                        {totals.pending_stores}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {totals.pending_stores} Store{totals.pending_stores > 1 ? 's' : ''} Awaiting Approval
                      </h3>
                      <p className="text-gray-600 mt-1">
                        New store submissions need your review
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/admin/stores')}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Review Now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Stats Grid with Glass Morphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card - Premium Design */}
          <div className="group relative bg-white rounded-3xl shadow-xl p-1 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-up overflow-hidden">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-3xl opacity-100 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Inner Card with Glass Effect */}
            <div className="relative bg-white rounded-3xl p-6 h-full">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full -ml-12 -mb-12 opacity-30"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <FaUsers className="text-3xl text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Total Users</p>
                    <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{totals.users}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-2">
                      <FaArrowUp className="text-green-600 text-xs" />
                    </div>
                    <span className="text-sm font-bold text-gray-900">+{recent_activity.new_users_30d}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">this month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Stores Card - Premium Design */}
          <div className="group relative bg-white rounded-3xl shadow-xl p-1 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-up animation-delay-100 overflow-hidden">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl opacity-100 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Inner Card with Glass Effect */}
            <div className="relative bg-white rounded-3xl p-6 h-full">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-50 to-emerald-50 rounded-full -ml-12 -mb-12 opacity-30"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <FaStore className="text-3xl text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Total Stores</p>
                    <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{totals.stores}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-2">
                      <FaArrowUp className="text-green-600 text-xs" />
                    </div>
                    <span className="text-sm font-bold text-gray-900">+{recent_activity.new_stores_30d}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">this month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Listings Card - Premium Design */}
          <div className="group relative bg-white rounded-3xl shadow-xl p-1 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-up animation-delay-200 overflow-hidden">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600 rounded-3xl opacity-100 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Inner Card with Glass Effect */}
            <div className="relative bg-white rounded-3xl p-6 h-full">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-50 to-pink-50 rounded-full -ml-12 -mb-12 opacity-30"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <FaMotorcycle className="text-3xl text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Total Listings</p>
                    <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{totals.listings}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-2">
                      <FaArrowUp className="text-green-600 text-xs" />
                    </div>
                    <span className="text-sm font-bold text-gray-900">+{recent_activity.new_listings_30d}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">this month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Published Listings Card - Premium Design */}
          <div className="group relative bg-white rounded-3xl shadow-xl p-1 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-up animation-delay-300 overflow-hidden">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-3xl opacity-100 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Inner Card with Glass Effect */}
            <div className="relative bg-white rounded-3xl p-6 h-full">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-50 to-yellow-50 rounded-full -ml-12 -mb-12 opacity-30"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <FaCheckCircle className="text-3xl text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Published</p>
                    <p className="text-4xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{totals.published_listings}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-2">
                      <span className="text-xs font-bold text-gray-700">{totals.sold_listings}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">sold</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{publishedPercentage.toFixed(0)}% active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Distribution Chart - Premium Glass Design */}
          <div className="group relative bg-white rounded-3xl shadow-xl p-1 animate-fade-in overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-3xl opacity-50"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <FaChartLine className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">User Distribution</h2>
              </div>
            <div className="space-y-6">
              {/* Buyers Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Buyers</span>
                  <span className="text-sm font-bold text-blue-600">{totals.buyers} ({buyerPercentage.toFixed(1)}%)</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{width: `${buyerPercentage}%`}}
                  ></div>
                </div>
              </div>

              {/* Sellers Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Sellers</span>
                  <span className="text-sm font-bold text-green-600">{totals.sellers} ({sellerPercentage.toFixed(1)}%)</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out animation-delay-200"
                    style={{width: `${sellerPercentage}%`}}
                  ></div>
                </div>
              </div>

              {/* Visual Pie Chart */}
              <div className="flex items-center justify-center space-x-8 mt-8">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-3">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                      <circle 
                        cx="64" cy="64" r="56" 
                        stroke="url(#blueGradient)" 
                        strokeWidth="16" 
                        fill="none"
                        strokeDasharray={`${buyerPercentage * 3.51} 351`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaUsers className="text-3xl text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Buyers</p>
                  <p className="text-2xl font-bold text-blue-600">{totals.buyers}</p>
                </div>

                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-3">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                      <circle 
                        cx="64" cy="64" r="56" 
                        stroke="url(#greenGradient)" 
                        strokeWidth="16" 
                        fill="none"
                        strokeDasharray={`${sellerPercentage * 3.51} 351`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaStore className="text-3xl text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Sellers</p>
                  <p className="text-2xl font-bold text-green-600">{totals.sellers}</p>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Listing Status Chart - Premium Glass Design */}
          <div className="group relative bg-white rounded-3xl shadow-xl p-1 animate-fade-in animation-delay-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-3xl opacity-50"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <FaMotorcycle className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Listing Status</h2>
              </div>
              <div className="space-y-4">
              {listings_by_status.map((status, index) => {
                const percentage = totals.listings > 0 ? (status.count / totals.listings) * 100 : 0;
                const colors = {
                  published: { bg: 'from-green-500 to-green-600', text: 'text-green-600', dot: 'bg-green-500' },
                  draft: { bg: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600', dot: 'bg-yellow-500' },
                  sold: { bg: 'from-gray-500 to-gray-600', text: 'text-gray-600', dot: 'bg-gray-500' }
                };
                const color = colors[status.status] || colors.draft;

                return (
                  <div key={status.status} className="group">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${color.dot} mr-3 group-hover:scale-125 transition-transform`}></div>
                        <span className="text-sm font-semibold text-gray-700 capitalize">{status.status}</span>
                      </div>
                      <span className={`text-sm font-bold ${color.text}`}>{status.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${color.bg} rounded-full transition-all duration-1000 ease-out`}
                        style={{width: `${percentage}%`, animationDelay: `${index * 200}ms`}}
                      ></div>
                    </div>
                  </div>
                );
                })}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{totals.listings}</p>
                  <p className="text-xs text-gray-500 mt-1">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{totals.published_listings}</p>
                  <p className="text-xs text-gray-500 mt-1">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">{totals.sold_listings}</p>
                  <p className="text-xs text-gray-500 mt-1">Sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Stores Table - Premium Design */}
        <div className="group relative bg-white rounded-3xl shadow-xl p-1 mb-8 animate-fade-in animation-delay-400 overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 rounded-3xl opacity-50"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <FaChartBar className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Top Performing Stores</h2>
            </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Rank</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Store Name</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Location</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Listings</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {top_stores.map((store, index) => (
                  <tr 
                    key={store.id} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group"
                  >
                    <td className="py-4 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{store.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">{store.city}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <FaMotorcycle className="text-purple-500 mr-2" />
                        <span className="font-bold text-gray-900">{store.listings_count}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        store.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {store.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Most Viewed Listings - Premium Design */}
        <div className="group relative bg-white rounded-3xl shadow-xl p-1 mb-8 animate-fade-in animation-delay-600 overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-3xl opacity-50"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <FaEye className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Most Viewed Listings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Title</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Store</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Price</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Views</th>
                </tr>
              </thead>
              <tbody>
                {most_viewed_listings.map((listing) => (
                  <tr 
                    key={listing.id} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent transition-all duration-200 group"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{listing.title}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">{listing.store?.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-green-600">₱{listing.price.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <FaEye className="text-indigo-500 mr-2" />
                        <span className="font-bold text-gray-900">{listing.views}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions - Premium Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in animation-delay-800">
          <button
            onClick={() => navigate('/admin/users')}
            className="group relative bg-white rounded-3xl shadow-xl p-1 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <FaUsers className="text-4xl" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <span className="text-3xl font-black">{totals.users}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Manage Users</h3>
              <p className="text-sm text-blue-100 mb-4">View and manage all users</p>
              <div className="flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform">
                <span>Go to Users</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/stores')}
            className="group relative bg-white rounded-3xl shadow-xl p-1 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl"></div>
            <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <FaStore className="text-4xl" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <span className="text-3xl font-black">{totals.stores}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Manage Stores</h3>
              <p className="text-sm text-green-100 mb-4">View and manage all stores</p>
              <div className="flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform">
                <span>Go to Stores</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/listings')}
            className="group relative bg-white rounded-3xl shadow-xl p-1 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl"></div>
            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <FaMotorcycle className="text-4xl" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <span className="text-3xl font-black">{totals.listings}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Manage Listings</h3>
              <p className="text-sm text-purple-100 mb-4">View and manage all listings</p>
              <div className="flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform">
                <span>Go to Listings</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          from {
            width: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-progress {
          animation: progress 1.5s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
