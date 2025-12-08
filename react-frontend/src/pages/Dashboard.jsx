import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  FaHome, FaStore, FaMotorcycle, FaChartBar, FaUser, FaCog,
  FaPlus, FaEye, FaDollarSign, FaEdit, FaTrash, FaBox, FaHeart,
  FaBars, FaTimes, FaSignOutAlt
} from 'react-icons/fa';

const DashboardNew = () => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [myStores, setMyStores] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
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
      if (user?.role === 'seller') {
        const [storesRes, listingsRes] = await Promise.all([
          api.get('/my-stores'),
          api.get('/my-listings'),
        ]);
        setMyStores(storesRes.data || []);
        setMyListings(listingsRes.data || []);
        calculateAnalytics(storesRes.data || [], listingsRes.data || []);
      } else {
        // Fetch buyer data
        const favoritesRes = await api.get('/favorites');
        setFavorites(favoritesRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMyStores([]);
      setMyListings([]);
      setFavorites([]);
      setAnalytics({
        totalStores: 0,
        totalListings: 0,
        publishedListings: 0,
        totalViews: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (stores, listings) => {
    const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
    const totalRevenue = listings
      .filter(l => l.status === 'sold')
      .reduce((sum, l) => sum + parseFloat(l.price || 0), 0);
    
    setAnalytics({
      totalStores: stores.length,
      totalListings: listings.length,
      publishedListings: listings.filter(l => l.status === 'published').length,
      totalViews,
      totalRevenue,
    });
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await api.delete(`/listings/${id}`);
      setMyListings(myListings.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  const sidebarItems = user?.role === 'seller' ? [
    { id: 'overview', label: 'Overview', icon: <FaHome /> },
    { id: 'stores', label: 'My Stores', icon: <FaStore /> },
    { id: 'listings', label: 'My Listings', icon: <FaMotorcycle /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
  ] : [
    { id: 'overview', label: 'Overview', icon: <FaHome /> },
    { id: 'favorites', label: 'My Favorites', icon: <FaHeart /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="font-bold text-gray-900">Dashboard</h2>
              <p className="text-xs text-gray-500">{user?.role === 'seller' ? 'Seller' : 'Buyer'}</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-gray-200">
          {user?.role === 'buyer' && (
            <button
              onClick={() => switchRole('seller')}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all mb-1"
            >
              <FaStore className="text-lg" />
              {sidebarOpen && <span className="text-sm font-medium">Switch to Seller</span>}
            </button>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome back, {user?.name}!</h1>
              
              {user?.role === 'seller' ? (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                      icon={<FaStore />}
                      label="Total Stores"
                      value={analytics?.totalStores || 0}
                      color="blue"
                    />
                    <StatCard
                      icon={<FaMotorcycle />}
                      label="Total Listings"
                      value={analytics?.totalListings || 0}
                      color="green"
                    />
                    <StatCard
                      icon={<FaEye />}
                      label="Total Views"
                      value={analytics?.totalViews || 0}
                      color="purple"
                    />
                    <StatCard
                      icon={<FaDollarSign />}
                      label="Revenue"
                      value={`₱${(analytics?.totalRevenue || 0).toLocaleString()}`}
                      color="orange"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link
                        to="/stores/create"
                        className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FaPlus className="text-blue-600 text-xl" />
                        <span className="font-medium text-blue-900">Create Store</span>
                      </Link>
                      <Link
                        to="/listings/create"
                        className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <FaPlus className="text-green-600 text-xl" />
                        <span className="font-medium text-green-900">Add Listing</span>
                      </Link>
                      <button
                        onClick={() => setActiveTab('analytics')}
                        className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <FaChartBar className="text-purple-600 text-xl" />
                        <span className="font-medium text-purple-900">View Analytics</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Listings */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-bold mb-4">Recent Listings</h2>
                    <div className="space-y-3">
                      {myListings.slice(0, 5).map((listing) => (
                        <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">{listing.title}</h3>
                            <p className="text-sm text-gray-500">₱{parseFloat(listing.price).toLocaleString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            listing.status === 'published' ? 'bg-green-100 text-green-700' :
                            listing.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h2>
                  <p className="text-gray-600 mb-6">Start exploring motorcycles and save your favorites!</p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to="/search"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Motorcycles
                    </Link>
                    <button
                      onClick={() => switchRole('seller')}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Become a Seller
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stores Tab */}
          {activeTab === 'stores' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Stores</h1>
                <Link
                  to="/stores/create"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus />
                  <span>Create Store</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myStores.map((store) => (
                  <div key={store.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
                    {store.logo && (
                      <img
                        src={`http://localhost:8000/storage/${store.logo}`}
                        alt={store.name}
                        className="w-16 h-16 rounded-lg object-cover mb-3"
                      />
                    )}
                    <h3 className="font-bold text-lg mb-2">{store.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{store.address}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Link
                        to={`/stores/${store.id}/edit`}
                        className="px-3 py-2 bg-blue-600 text-white rounded text-center text-sm hover:bg-blue-700 transition"
                      >
                        Edit Store
                      </Link>
                      <Link
                        to={`/stores/${store.id}`}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-center text-sm hover:bg-gray-300 transition"
                      >
                        View Store
                      </Link>
                    </div>
                    
                    <Link
                      to={`/stores/${store.id}/spare-parts`}
                      className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition"
                    >
                      <FaBox />
                      <span>Manage Spare Parts</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
                <Link
                  to="/listings/create"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus />
                  <span>Add Listing</span>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {myListings.map((listing) => (
                      <tr key={listing.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{listing.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">₱{parseFloat(listing.price).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === 'published' ? 'bg-green-100 text-green-700' :
                            listing.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{listing.views || 0}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Link
                              to={`/listings/${listing.id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
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

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Detailed analytics coming soon...</p>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">My Favorites</h1>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((fav) => {
                    const listing = fav.listing || fav;
                    return (
                      <Link
                        key={fav.id}
                        to={`/listings/${listing.id}`}
                        className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                      >
                        <div className="aspect-video bg-gray-200">
                          {listing.images && listing.images[0] && (
                            <img
                              src={`http://localhost:8000/storage/${listing.images[0].image_path}`}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2">{listing.title}</h3>
                          <p className="text-2xl font-black text-blue-600">
                            ₱{parseFloat(listing.price).toLocaleString()}
                          </p>
                          <div className="mt-2 flex items-center text-sm text-gray-600">
                            <FaEye className="mr-1" />
                            <span>{listing.views || 0} views</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No Favorites Yet</h2>
                  <p className="text-gray-600 mb-6">Start exploring and save your favorite motorcycles!</p>
                  <Link
                    to="/search"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Motorcycles
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaCog />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className={`w-10 h-10 bg-gradient-to-r ${colors[color]} rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default DashboardNew;
