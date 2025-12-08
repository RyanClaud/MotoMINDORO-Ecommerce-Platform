import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  FaStore, FaMotorcycle, FaChartBar, FaUser,
  FaPlus, FaEye, FaDollarSign, FaEdit, FaTrash, FaBox, FaHeart
} from 'react-icons/fa';

const DashboardNew = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [myStores, setMyStores] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }
    
    fetchMyData();
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

  const tabs = user?.role === 'seller' ? [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'stores', label: 'My Stores', icon: <FaStore /> },
    { id: 'listings', label: 'My Listings', icon: <FaMotorcycle /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
  ] : [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'favorites', label: 'My Favorites', icon: <FaHeart /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
  ];

  if (loading) {
    return (
      <div className="compact-page flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="compact-page overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
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
                  <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link
                        to="/stores/create"
                        className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        <FaPlus className="text-blue-600 text-2xl" />
                        <span className="font-semibold text-blue-900">Create Store</span>
                      </Link>
                      <Link
                        to="/listings/create"
                        className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                      >
                        <FaPlus className="text-green-600 text-2xl" />
                        <span className="font-semibold text-green-900">Add Listing</span>
                      </Link>
                      <button
                        onClick={() => setActiveTab('stores')}
                        className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                      >
                        <FaBox className="text-purple-600 text-2xl" />
                        <span className="font-semibold text-purple-900">Manage Spare Parts</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Listings */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Listings</h2>
                    <div className="space-y-3">
                      {myListings.slice(0, 5).map((listing) => (
                        <div key={listing.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                          <div>
                            <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                            <p className="text-sm text-gray-600">₱{parseFloat(listing.price).toLocaleString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                <div className="bg-white rounded-xl shadow p-12 text-center">
                  <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h2>
                  <p className="text-gray-600 mb-6">Start exploring motorcycles and save your favorites!</p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to="/search"
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                    >
                      Browse Motorcycles
                    </Link>
                    <button
                      onClick={() => switchRole('seller')}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
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
                <h2 className="text-2xl font-bold text-gray-900">My Stores</h2>
                <Link
                  to="/stores/create"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                >
                  <FaPlus />
                  <span>Create Store</span>
                </Link>
              </div>

              {myStores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myStores.map((store) => (
                    <div key={store.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
                      {store.logo && (
                        <img
                          src={`http://localhost:8000/storage/${store.logo}`}
                          alt={store.name}
                          className="w-20 h-20 rounded-xl object-cover mb-4"
                        />
                      )}
                      <h3 className="font-bold text-xl mb-2">{store.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{store.address}</p>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to={`/stores/${store.id}/edit`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center text-sm font-semibold hover:bg-blue-700 transition"
                          >
                            Edit Store
                          </Link>
                          <Link
                            to={`/stores/${store.id}`}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-center text-sm font-semibold hover:bg-gray-300 transition"
                          >
                            View Store
                          </Link>
                        </div>
                        
                        <Link
                          to={`/stores/${store.id}/spare-parts`}
                          className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition"
                        >
                          <FaBox />
                          <span>Manage Spare Parts</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                  <FaStore className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Stores Yet</h3>
                  <p className="text-gray-600 mb-6">Create your first store to start selling</p>
                  <Link
                    to="/stores/create"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                  >
                    <FaPlus />
                    <span>Create Your First Store</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
                <Link
                  to="/listings/create"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                >
                  <FaPlus />
                  <span>Add Listing</span>
                </Link>
              </div>

              {myListings.length > 0 ? (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Title</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Price</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Views</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {myListings.map((listing) => (
                          <tr key={listing.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{listing.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">₱{parseFloat(listing.price).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                listing.status === 'published' ? 'bg-green-100 text-green-700' :
                                listing.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {listing.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{listing.views || 0}</td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Link
                                  to={`/listings/${listing.id}/edit`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                >
                                  <FaEdit />
                                </Link>
                                <button
                                  onClick={() => handleDeleteListing(listing.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
              ) : (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                  <FaMotorcycle className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Listings Yet</h3>
                  <p className="text-gray-600 mb-6">Add your first motorcycle listing</p>
                  <Link
                    to="/listings/create"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                  >
                    <FaPlus />
                    <span>Add Your First Listing</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Favorites</h2>
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
                <div className="bg-white rounded-xl shadow p-12 text-center">
                  <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h3>
                  <p className="text-gray-600 mb-6">Start exploring and save your favorite motorcycles!</p>
                  <Link
                    to="/search"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                  >
                    Browse Motorcycles
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Insights</h2>
              
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
                  <FaStore className="text-3xl mb-3 opacity-80" />
                  <p className="text-sm opacity-90 mb-1">Total Stores</p>
                  <p className="text-4xl font-black">{analytics?.totalStores || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow p-6 text-white">
                  <FaMotorcycle className="text-3xl mb-3 opacity-80" />
                  <p className="text-sm opacity-90 mb-1">Total Listings</p>
                  <p className="text-4xl font-black">{analytics?.totalListings || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow p-6 text-white">
                  <FaEye className="text-3xl mb-3 opacity-80" />
                  <p className="text-sm opacity-90 mb-1">Total Views</p>
                  <p className="text-4xl font-black">{analytics?.totalViews || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow p-6 text-white">
                  <FaDollarSign className="text-3xl mb-3 opacity-80" />
                  <p className="text-sm opacity-90 mb-1">Revenue</p>
                  <p className="text-3xl font-black">₱{(analytics?.totalRevenue || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Listings by Status */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-xl font-bold mb-4">Listings by Status</h3>
                  <div className="space-y-4">
                    {[
                      { status: 'Published', count: analytics?.publishedListings || 0, color: 'bg-green-500' },
                      { status: 'Draft', count: (analytics?.totalListings || 0) - (analytics?.publishedListings || 0) - (myListings.filter(l => l.status === 'sold').length || 0), color: 'bg-yellow-500' },
                      { status: 'Sold', count: myListings.filter(l => l.status === 'sold').length || 0, color: 'bg-blue-500' }
                    ].map((item) => {
                      const percentage = analytics?.totalListings > 0 ? (item.count / analytics.totalListings) * 100 : 0;
                      return (
                        <div key={item.status}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">{item.status}</span>
                            <span className="text-sm font-bold text-gray-900">{item.count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.color} transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Performing Listings */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-xl font-bold mb-4">Top Viewed Listings</h3>
                  <div className="space-y-3">
                    {myListings
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 5)
                      .map((listing) => (
                        <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{listing.title}</p>
                            <p className="text-xs text-gray-600">₱{parseFloat(listing.price).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaEye className="text-purple-600" />
                            <span className="font-bold text-gray-900">{listing.views || 0}</span>
                          </div>
                        </div>
                      ))}
                    {myListings.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No listings yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stores Performance */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-4">Stores Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Store Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Listings</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Published</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Total Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {myStores.map((store) => {
                        const storeListings = myListings.filter(l => l.store_id === store.id);
                        const publishedCount = storeListings.filter(l => l.status === 'published').length;
                        const totalViews = storeListings.reduce((sum, l) => sum + (l.views || 0), 0);
                        
                        return (
                          <tr key={store.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{store.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{storeListings.length}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{publishedCount}</td>
                            <td className="px-4 py-3 text-sm font-bold text-purple-600">{totalViews}</td>
                          </tr>
                        );
                      })}
                      {myStores.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                            No stores yet. Create your first store to see analytics.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
              <div className="bg-white rounded-xl shadow p-8">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <span className="inline-block mt-2 px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                >
                  <FaUser />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
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
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
      <div className={`w-12 h-12 bg-gradient-to-r ${colors[color]} rounded-xl flex items-center justify-center text-white text-2xl mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default DashboardNew;
