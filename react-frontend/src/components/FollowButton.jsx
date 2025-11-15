import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FaUserPlus, FaUserCheck, FaSpinner } from 'react-icons/fa';

const FollowButton = ({ sellerId, initialFollowState = false, onFollowChange }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && sellerId) {
      checkFollowStatus();
    }
  }, [user, sellerId]);

  const checkFollowStatus = async () => {
    try {
      const response = await api.get(`/check-following/${sellerId}`);
      setIsFollowing(response.data.is_following);
      setFollowerCount(response.data.follower_count);
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const toggleFollow = async () => {
    if (!user) {
      alert('Please login to follow sellers');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      if (isFollowing) {
        // Unfollow
        const response = await api.delete(`/unfollow/${sellerId}`);
        setIsFollowing(false);
        setFollowerCount(response.data.follower_count);
        
        if (onFollowChange) {
          onFollowChange(false, response.data.follower_count);
        }
      } else {
        // Follow
        const response = await api.post(`/follow/${sellerId}`);
        setIsFollowing(true);
        setFollowerCount(response.data.follower_count);
        
        if (onFollowChange) {
          onFollowChange(true, response.data.follower_count);
        }
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
      setError(err.response?.data?.error || 'Failed to update follow status');
      
      // Show error to user
      alert(err.response?.data?.error || 'Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  // Don't show button if viewing own profile
  if (user && user.id === sellerId) {
    return null;
  }

  // Don't show if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={toggleFollow}
        disabled={loading}
        className={`
          group relative flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold
          transition-all duration-300 transform hover:scale-105 shadow-lg
          ${isFollowing 
            ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
        `}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin text-xl" />
            <span>Processing...</span>
          </>
        ) : isFollowing ? (
          <>
            <FaUserCheck className="text-xl" />
            <span>Following</span>
          </>
        ) : (
          <>
            <FaUserPlus className="text-xl" />
            <span>Follow</span>
          </>
        )}
      </button>

      {/* Follower Count */}
      {followerCount > 0 && (
        <div className="text-sm text-gray-600 font-medium">
          {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default FollowButton;
