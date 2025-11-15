import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ListingCard from './ListingCard';
import { FaArrowRight, FaSpinner } from 'react-icons/fa';

const SimilarListings = ({ currentListingId, limit = 6 }) => {
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentListingId) {
      fetchSimilarListings();
    }
  }, [currentListingId, limit]);

  const fetchSimilarListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/recommendations/similar/${currentListingId}?limit=${limit}`);
      setSimilarListings(response.data.data || []);
    } catch (err) {
      console.error('Error fetching similar listings:', err);
      setError('Failed to load similar motorcycles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error || similarListings.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Similar Motorcycles
            </h2>
            <p className="text-gray-600 mt-1">
              You might also be interested in these
            </p>
          </div>
          <Link
            to="/search"
            className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <span>View All</span>
            <FaArrowRight />
          </Link>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div className="relative">
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide snap-x snap-mandatory">
            {similarListings.map((listing, index) => (
              <div
                key={listing.id}
                className="flex-shrink-0 w-72 snap-start transform transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="md:hidden mt-6 text-center">
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <span>View All Motorcycles</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default SimilarListings;
