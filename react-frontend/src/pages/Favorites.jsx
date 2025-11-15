import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ListingCard from '../components/ListingCard';
import { FaHeart, FaSearch } from 'react-icons/fa';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      const favoritesData = response.data.data || response.data || [];
      
      // Filter out any invalid favorites
      const validFavorites = favoritesData.filter(fav => {
        const listing = fav.listing || fav;
        return listing && listing.id;
      });
      
      setFavorites(validFavorites);
      
      // Create set of favorite IDs
      const ids = new Set(validFavorites.map(fav => {
        const listing = fav.listing || fav;
        return listing.id;
      }));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (listingId) => {
    try {
      const response = await api.post(`/favorites/${listingId}`);
      
      // If successfully toggled (removed), update the UI
      if (response.data.is_favorited === false) {
        // Remove from favorites list
        setFavorites(prev => prev.filter(fav => {
          const favListingId = fav.listing_id || fav.motorcycles_listing_id || (fav.listing && fav.listing.id);
          return favListingId !== listingId;
        }));
        setFavoriteIds(prev => {
          const newIds = new Set(prev);
          newIds.delete(listingId);
          return newIds;
        });
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <FaHeart className="text-4xl" />
            <h1 className="text-4xl font-bold">My Favorites</h1>
          </div>
          <p className="text-xl text-red-100">
            {favorites.length} motorcycle{favorites.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-6xl text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No favorites yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding motorcycles to your favorites by clicking the heart icon on listings you like!
            </p>
            <Link
              to="/search"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaSearch />
              <span>Browse Motorcycles</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Click the heart icon again to remove from favorites
              </p>
              <Link
                to="/search"
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
              >
                <FaSearch />
                <span>Find More</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((favorite) => {
                // Handle both response formats: favorite.listing or favorite itself
                const listing = favorite.listing || favorite;
                if (!listing || !listing.id) return null;
                
                return (
                  <ListingCard 
                    key={`favorite-${favorite.id || favorite.listing_id || listing.id}`}
                    listing={listing}
                    onFavorite={handleFavorite}
                    isFavorited={favoriteIds.has(listing.id)}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
