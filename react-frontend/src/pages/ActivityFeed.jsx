import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  FaMotorcycle, FaStore, FaDollarSign, FaCheckCircle, 
  FaSpinner, FaClock, FaUserFriends 
} from 'react-icons/fa';

const ActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user, page]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/activity-feed?page=${page}&per_page=20`);
      
      if (page === 1) {
        setActivities(response.data.data || []);
      } else {
        setActivities(prev => [...prev, ...(response.data.data || [])]);
      }
      
      setHasMore(response.data.current_page < response.data.last_page);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_listing':
        return <FaMotorcycle className="text-blue-600" />;
      case 'price_change':
        return <FaDollarSign className="text-green-600" />;
      case 'store_update':
        return <FaStore className="text-purple-600" />;
      case 'listing_sold':
        return <FaCheckCircle className="text-orange-600" />;
      default:
        return <FaMotorcycle className="text-gray-600" />;
    }
  };

  const getActivityMessage = (activity) => {
    const userName = activity.user?.name || 'A seller';
    const metadata = activity.metadata || {};

    switch (activity.activity_type) {
      case 'new_listing':
        return (
          <>
            <strong>{userName}</strong> posted a new motorcycle: <strong>{metadata.title}</strong>
          </>
        );
      case 'price_change':
        return (
          <>
            <strong>{userName}</strong> changed the price of <strong>{metadata.title}</strong> from 
            ₱{metadata.old_price?.toLocaleString()} to ₱{metadata.new_price?.toLocaleString()}
          </>
        );
      case 'store_update':
        return (
          <>
            <strong>{userName}</strong> updated their store
          </>
        );
      case 'listing_sold':
        return (
          <>
            <strong>{userName}</strong> sold <strong>{metadata.title}</strong>
          </>
        );
      default:
        return <>{userName} performed an action</>;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUserFriends className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your activity feed</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Activity Feed</h1>
          <p className="text-gray-600">
            Stay updated with the latest from sellers you follow
          </p>
        </div>

        {/* Activities List */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchActivities()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaUserFriends className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Activities Yet</h3>
            <p className="text-gray-600 mb-6">
              Follow sellers to see their latest updates here
            </p>
            <Link
              to="/search"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Browse Motorcycles
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                      {getActivityIcon(activity.activity_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 mb-2">
                        {getActivityMessage(activity)}
                      </p>

                      {/* Timestamp */}
                      <div className="flex items-center text-sm text-gray-500">
                        <FaClock className="mr-1" />
                        {formatTimeAgo(activity.created_at)}
                      </div>

                      {/* Listing Link */}
                      {activity.listing_id && (
                        <Link
                          to={`/listings/${activity.listing_id}`}
                          className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          View Listing →
                        </Link>
                      )}
                    </div>

                    {/* Listing Image */}
                    {activity.listing?.primary_image && (
                      <Link
                        to={`/listings/${activity.listing_id}`}
                        className="flex-shrink-0 hidden sm:block"
                      >
                        <img
                          src={`http://localhost:8000/storage/${activity.listing.primary_image.image_path}`}
                          alt="Listing"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="inline animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
