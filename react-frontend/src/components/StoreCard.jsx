import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaStar } from 'react-icons/fa';
import generateStoreBanner from '../utils/generateStoreBanner';

const StoreCard = ({ store }) => {
  const averageRating = store.average_rating || 0;
  const bannerData = generateStoreBanner(store.name, store.shop_type);

  return (
    <Link to={`/stores/${store.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow p-4">
        <div className="flex items-start space-x-4">
          {/* Auto-generated logo */}
          <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${bannerData.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <div className="text-center">
              <div className="text-3xl mb-1">{bannerData.icon}</div>
              <div className="text-xs font-bold text-white opacity-90">{bannerData.initials}</div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-2">
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                store.shop_type === 'motorcycle_shop' ? 'bg-blue-100 text-blue-800' :
                store.shop_type === 'vulcanizing_shop' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {store.shop_type === 'motorcycle_shop' ? '🏍️ Motorcycle Shop' :
                 store.shop_type === 'vulcanizing_shop' ? '🔧 Vulcanizing Shop' :
                 '⛽ Gas Station'}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-1">
              {store.name}
            </h3>

            <div className="flex items-center text-sm text-gray-600 mb-2">
              <FaMapMarkerAlt className="mr-1" />
              <span>{store.city}, {store.state}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-2">
              <FaPhone className="mr-1" />
              <span>{store.phone}</span>
            </div>

            {averageRating > 0 && (
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-sm font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({store.reviews?.length || 0} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        {store.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
            {store.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default StoreCard;
