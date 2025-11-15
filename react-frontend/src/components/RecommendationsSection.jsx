import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ListingCard from './ListingCard';
import { FaLightbulb, FaSpinner } from 'react-icons/fa';

const RecommendationsSection = ({ limit = 8 }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [user, limit]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/recommendations/personalized?limit=${limit}`);
      setRecommendations(response.data.data || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleListingClick = async (listingId) => {
    // Track click interaction
    try {
      await api.post('/interactions', {
        listing_id: listingId,
        interaction_type: 'view'
      });
    } catch (err) {
      console.error('Error tracking interaction:', err);
    }
  };

  // Don't show section if user is not authenticated
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
              <FaLightbulb className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Recommended For You
              </h2>
              <p className="text-gray-600 mt-1">
                Based on your browsing history and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((listing, index) => (
            <div
              key={listing.id}
              className="transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleListingClick(listing.id)}
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;
