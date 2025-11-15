import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import FollowButton from './FollowButton';
import ListingCard from './ListingCard';
import { FaStore, FaMotorcycle, FaStar, FaCalendar, FaSpinner } from 'react-icons/fa';

const SellerProfile = ({ sellerId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerId) {
      fetchProfile();
    }
  }, [sellerId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/seller-profile/${sellerId}`);
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching seller profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!profile) return null;

  const { user, stats, recent_listings } = profile;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
          <p className="text-gray-600 mb-4">Member since {stats.member_since}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.follower_count}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_listings}</div>
              <div className="text-sm text-gray-600">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.average_rating}</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_reviews}</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
          </div>
        </div>
        
        <FollowButton sellerId={sellerId} />
      </div>

      {recent_listings && recent_listings.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recent_listings.slice(0, 3).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
