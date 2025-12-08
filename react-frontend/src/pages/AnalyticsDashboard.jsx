import { useState, useEffect } from 'react';
import { FaUsers, FaStore, FaEye, FaChartLine, FaMotorcycle, FaEnvelope, FaSearch, FaTrophy } from 'react-icons/fa';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics/dashboard');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights and platform statistics</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex space-x-2">
          {['7days', '30days', '90days', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range === '7days' && 'Last 7 Days'}
              {range === '30days' && 'Last 30 Days'}
              {range === '90days' && 'Last 90 Days'}
              {range === 'all' && 'All Time'}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FaUsers />}
            title="Total Users"
            value={analytics?.summary?.totalUsers || 0}
            change="+12%"
            changeType="positive"
            color="blue"
          />
          <StatCard
            icon={<FaStore />}
            title="Active Stores"
            value={analytics?.summary?.totalStores || 0}
            change="+8%"
            changeType="positive"
            color="green"
          />
          <StatCard
            icon={<FaMotorcycle />}
            title="Total Listings"
            value={analytics?.summary?.totalListings || 0}
            change="+15%"
            changeType="positive"
            color="purple"
          />
          <StatCard
            icon={<FaEye />}
            title="Page Views"
            value={analytics?.summary?.totalViews || 0}
            change="+25%"
            changeType="positive"
            color="orange"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MiniStatCard
            icon={<FaEnvelope />}
            title="Messages Today"
            value={analytics?.today?.total_messages || 0}
            color="indigo"
          />
          <MiniStatCard
            icon={<FaSearch />}
            title="Searches Today"
            value={analytics?.today?.total_searches || 0}
            color="pink"
          />
          <MiniStatCard
            icon={<FaChartLine />}
            title="Active Today"
            value={analytics?.summary?.activeToday || 0}
            color="teal"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaChartLine className="mr-2 text-blue-600" />
              User Growth
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-500">
              {analytics?.userGrowth && analytics.userGrowth.length > 0 ? (
                <SimpleLineChart data={analytics.userGrowth} />
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>

          {/* Activity Distribution */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analytics?.recentActivity?.slice(0, 8).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {activity.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500 capitalize">{activity.activity_type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Stores */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaTrophy className="mr-2 text-yellow-500" />
            Top Performing Stores
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Store Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Visits</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.topStores?.map((store, index) => (
                  <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{store.name}</td>
                    <td className="py-3 px-4 text-gray-600">{store.city}</td>
                    <td className="py-3 px-4 text-gray-900 font-semibold">{store.visits_count || 0}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ⭐ {store.rating_average || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, changeType, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1">
      <div className={`w-14 h-14 bg-gradient-to-r ${colors[color]} rounded-xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</p>
      <p className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
        {change} from last period
      </p>
    </div>
  );
};

const MiniStatCard = ({ icon, title, value, color }) => {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
    teal: 'bg-teal-100 text-teal-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex items-center space-x-4">
      <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center text-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  );
};

const SimpleLineChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.count));
  
  return (
    <div className="w-full h-full flex items-end space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-400"
            style={{ height: `${(item.count / maxValue) * 100}%`, minHeight: '10px' }}
          ></div>
          <span className="text-xs text-gray-500 mt-2">
            {new Date(item.date).getDate()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsDashboard;
