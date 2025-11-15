import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  FaUser, FaEnvelope, FaStore, FaMotorcycle, 
  FaHeart, FaCalendar, FaEdit, FaShieldAlt, FaStar,
  FaMapMarkerAlt, FaPhone, FaCheckCircle, FaUserCircle
} from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    stores: 0,
    listings: 0,
    favorites: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const [storesRes, listingsRes, favoritesRes] = await Promise.all([
        api.get('/my-stores').catch(() => ({ data: [] })),
        api.get('/my-listings').catch(() => ({ data: [] })),
        api.get('/favorites').catch(() => ({ data: { data: [] } })),
      ]);

      setStats({
        stores: storesRes.data?.length || 0,
        listings: listingsRes.data?.length || 0,
        favorites: favoritesRes.data?.data?.length || 0,
      });

      // Get recent listings as activity
      if (listingsRes.data && listingsRes.data.length > 0) {
        setRecentActivity(listingsRes.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'seller':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'buyer':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaShieldAlt className="text-purple-600" />;
      case 'seller':
        return <FaStore className="text-blue-600" />;
      case 'buyer':
        return <FaUser className="text-green-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header with Gradient */}
        <div className="mb-8 text-center">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              👤 Profile Dashboard
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4 animate-fade-in">
            My Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your account information, view statistics, and track your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Enhanced Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-2 border-blue-100">
              {/* Enhanced Profile Header with Pattern */}
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                </div>

                {/* Profile Picture with Ring Animation */}
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                  <div className="w-36 h-36 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl overflow-hidden ring-4 ring-white ring-opacity-50 relative z-10">
                    {user?.profile_photo ? (
                      <img
                        src={`http://localhost:8000/storage/${user.profile_photo}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <FaUserCircle 
                      className="text-9xl text-blue-600" 
                      style={{ display: user?.profile_photo ? 'none' : 'block' }}
                    />
                  </div>
                </div>

                <h2 className="text-3xl font-black text-white mb-3 drop-shadow-lg">{user?.name}</h2>
                <div className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-full border-2 shadow-lg backdrop-blur-sm ${getRoleBadgeColor(user?.role)}`}>
                  {getRoleIcon(user?.role)}
                  <span className="font-bold capitalize text-sm">{user?.role}</span>
                </div>
                
                {/* Business Logo for Sellers */}
                {user?.role === 'seller' && user?.business_logo && (
                  <div className="mt-6">
                    <p className="text-white text-sm mb-2">Business Logo</p>
                    <div className="w-24 h-24 bg-white rounded-xl mx-auto p-2 shadow-lg">
                      <img
                        src={`http://localhost:8000/storage/${user.business_logo}`}
                        alt="Business Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <FaEnvelope className="text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <p className="text-gray-900 font-medium break-all">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FaCalendar className="text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Member Since</p>
                    <p className="text-gray-900 font-medium">{formatDate(user?.created_at)}</p>
                  </div>
                </div>

                {user?.phone && (
                  <div className="flex items-start space-x-3">
                    <FaPhone className="text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                      <p className="text-gray-900 font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user?.address && (
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Address</p>
                      <p className="text-gray-900 font-medium">{user.address}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/profile/edit"
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Verification Badge */}
            {user?.email_verified_at && (
              <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-green-700">
                  <FaCheckCircle className="text-xl" />
                  <span className="font-semibold">Verified Account</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Your email has been verified
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Stats and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Statistics Cards with Gradients */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stores Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl p-6 hover:shadow-3xl transition-all transform hover:-translate-y-2 hover:scale-105 duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-2xl">
                      <FaStore className="text-4xl text-white" />
                    </div>
                    <span className="text-5xl font-black text-white drop-shadow-lg">{stats.stores}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 opacity-90">My Stores</h3>
                  <Link to="/dashboard" className="text-white hover:text-blue-100 text-sm font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>View Stores</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Listings Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl p-6 hover:shadow-3xl transition-all transform hover:-translate-y-2 hover:scale-105 duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-2xl">
                      <FaMotorcycle className="text-4xl text-white" />
                    </div>
                    <span className="text-5xl font-black text-white drop-shadow-lg">{stats.listings}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 opacity-90">My Listings</h3>
                  <Link to="/dashboard" className="text-white hover:text-indigo-100 text-sm font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>View Listings</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Favorites Card */}
              <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-3xl shadow-2xl p-6 hover:shadow-3xl transition-all transform hover:-translate-y-2 hover:scale-105 duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-2xl">
                      <FaHeart className="text-4xl text-white" />
                    </div>
                    <span className="text-5xl font-black text-white drop-shadow-lg">{stats.favorites}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 opacity-90">Favorites</h3>
                  <Link to="/favorites" className="text-white hover:text-red-100 text-sm font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>View Favorites</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaUser className="mr-3 text-blue-600" />
                Account Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900 break-all">{user?.email}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Account Type</p>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user?.role)}
                    <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(user?.created_at)}</p>
                </div>

                {user?.phone && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-900">{user.phone}</p>
                  </div>
                )}

                {user?.address && (
                  <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="text-lg font-semibold text-gray-900">{user.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaStar className="mr-3 text-yellow-500" />
                  Recent Activity
                </h2>

                <div className="space-y-4">
                  {recentActivity.map((listing) => (
                    <Link
                      key={listing.id}
                      to={`/listings/${listing.id}`}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all group"
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {listing.primary_image?.image_path ? (
                          <img
                            src={`http://localhost:8000/storage/${listing.primary_image.image_path}`}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=No+Image'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaMotorcycle className="text-3xl text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {listing.condition === 'brand_new' ? 'Brand New' : 'Second Hand'} • {listing.year}
                        </p>
                        <p className="text-lg font-bold text-blue-600 mt-1">
                          ₱{listing.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                        →
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  to="/dashboard"
                  className="block mt-6 text-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View All Activity →
                </Link>
              </div>
            )}

            {/* Enhanced Quick Actions with Hover Effects */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <FaStar className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user?.role === 'seller' && (
                  <>
                    <Link
                      to="/stores/create"
                      className="relative flex items-center space-x-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all group overflow-hidden border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400 opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg relative z-10">
                        <FaStore className="text-white text-2xl" />
                      </div>
                      <div className="relative z-10">
                        <p className="font-bold text-gray-900 text-lg">Create Store</p>
                        <p className="text-sm text-gray-600">Add a new store location</p>
                      </div>
                    </Link>

                    <Link
                      to="/listings/create"
                      className="relative flex items-center space-x-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl hover:from-indigo-100 hover:to-purple-100 transition-all group overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-400 opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg relative z-10">
                        <FaMotorcycle className="text-white text-2xl" />
                      </div>
                      <div className="relative z-10">
                        <p className="font-bold text-gray-900 text-lg">Add Listing</p>
                        <p className="text-sm text-gray-600">List a motorcycle for sale</p>
                      </div>
                    </Link>
                  </>
                )}

                <Link
                  to="/favorites"
                  className="relative flex items-center space-x-4 p-5 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl hover:from-red-100 hover:to-pink-100 transition-all group overflow-hidden border-2 border-red-200 hover:border-red-400 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-400 opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="bg-gradient-to-br from-red-600 to-pink-600 p-4 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg relative z-10">
                    <FaHeart className="text-white text-2xl" />
                  </div>
                  <div className="relative z-10">
                    <p className="font-bold text-gray-900 text-lg">My Favorites</p>
                    <p className="text-sm text-gray-600">View saved motorcycles</p>
                  </div>
                </Link>

                <Link
                  to="/profile/edit"
                  className="relative flex items-center space-x-4 p-5 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl hover:from-gray-100 hover:to-slate-100 transition-all group overflow-hidden border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gray-400 opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="bg-gradient-to-br from-gray-600 to-slate-600 p-4 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg relative z-10">
                    <FaEdit className="text-white text-2xl" />
                  </div>
                  <div className="relative z-10">
                    <p className="font-bold text-gray-900 text-lg">Edit Profile</p>
                    <p className="text-sm text-gray-600">Update your information</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <FaCheckCircle className="text-green-600 text-xl" />
                    <span className="font-semibold text-gray-900">Account Active</span>
                  </div>
                  <span className="text-green-600 font-bold">✓</span>
                </div>

                {user?.email_verified_at ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <FaCheckCircle className="text-green-600 text-xl" />
                      <span className="font-semibold text-gray-900">Email Verified</span>
                    </div>
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-yellow-600 text-xl" />
                      <span className="font-semibold text-gray-900">Email Not Verified</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                      Verify Now
                    </button>
                  </div>
                )}

                {user?.role === 'seller' && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <FaStore className="text-blue-600 text-xl" />
                      <span className="font-semibold text-gray-900">Seller Account</span>
                    </div>
                    <span className="text-blue-600 font-bold">✓</span>
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

export default Profile;

// Add custom styles for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(20px, -50px) scale(1.1);
    }
    50% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    75% {
      transform: translate(50px, 50px) scale(1.05);
    }
  }

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

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }

  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }

  .shadow-3xl {
    box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
  }
`;
if (!document.head.querySelector('style[data-profile-animations]')) {
  style.setAttribute('data-profile-animations', 'true');
  document.head.appendChild(style);
}
