import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ListingCard from '../components/ListingCard';
import RecommendationsSection from '../components/RecommendationsSection';
import { 
  FaSearch, FaMapMarkedAlt, FaMotorcycle, FaStore, FaHeart,
  FaShieldAlt, FaDollarSign, FaCheckCircle, FaStar, FaArrowRight,
  FaChevronDown
} from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFeaturedListings();
    
    // Add scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.observe-animation').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const response = await api.get('/listings/featured');
      setFeaturedListings(response.data.slice(0, 8));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-slow-zoom"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-blue-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-down">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient">
                Motorcycle
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover thousands of motorcycles from trusted sellers across the Philippines
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand, model, or keyword..."
                className="w-full px-8 py-6 pr-32 text-lg rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all shadow-2xl"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaSearch className="inline mr-2" />
                Search
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            <Link
              to="/search"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 flex items-center space-x-2"
            >
              <FaMotorcycle className="text-2xl" />
              <span>Browse Motorcycles</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/map"
              className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all shadow-2xl flex items-center space-x-2"
            >
              <FaMapMarkedAlt className="text-2xl" />
              <span>Explore Map</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <FaChevronDown className="text-white text-3xl opacity-50" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white observe-animation opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most trusted motorcycle marketplace in the Philippines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaShieldAlt,
                title: 'Verified Sellers',
                description: 'All sellers are verified for your safety and peace of mind',
                color: 'from-blue-500 to-indigo-500',
                bgColor: 'from-blue-50 to-indigo-50'
              },
              {
                icon: FaDollarSign,
                title: 'Best Prices',
                description: 'Competitive pricing with negotiable options available',
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50'
              },
              {
                icon: FaMapMarkedAlt,
                title: 'Location-Based',
                description: 'Find motorcycles and stores near your location',
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50'
              },
              {
                icon: FaHeart,
                title: 'Save Favorites',
                description: 'Bookmark your favorite motorcycles for later viewing',
                color: 'from-red-500 to-orange-500',
                bgColor: 'from-red-50 to-orange-50'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl shadow-xl p-1 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Inner Card */}
                <div className="relative bg-white rounded-3xl p-8 h-full">
                  {/* Decorative Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl`}>
                      <feature.icon className="text-4xl text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      <RecommendationsSection limit={8} />

      {/* Featured Listings */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white observe-animation opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Motorcycles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked motorcycles from our most trusted sellers
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 absolute top-0"></div>
              </div>
            </div>
          ) : featuredListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {featuredListings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="transform transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link
                  to="/search"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>View All Motorcycles</span>
                  <FaArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <FaMotorcycle className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No featured motorcycles available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white observe-animation opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Browse & Search',
                description: 'Explore thousands of motorcycles or use our advanced search to find exactly what you need',
                icon: FaSearch
              },
              {
                step: '02',
                title: 'Compare & Save',
                description: 'Compare prices, save your favorites, and check seller ratings and reviews',
                icon: FaHeart
              },
              {
                step: '03',
                title: 'Contact & Buy',
                description: 'Connect directly with sellers, negotiate prices, and make your purchase',
                icon: FaCheckCircle
              }
            ].map((item, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-6xl font-black text-white/20 mb-4">{item.step}</div>
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <item.icon className="text-3xl text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <FaArrowRight className="text-4xl text-white/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-20 bg-white observe-animation opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Motorcycles Listed', icon: FaMotorcycle, color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-50 to-indigo-50' },
              { number: '5,000+', label: 'Happy Customers', icon: FaHeart, color: 'from-red-500 to-pink-600', bgColor: 'from-red-50 to-pink-50' },
              { number: '500+', label: 'Verified Stores', icon: FaStore, color: 'from-green-500 to-emerald-600', bgColor: 'from-green-50 to-emerald-50' },
              { number: '4.8/5', label: 'Average Rating', icon: FaStar, color: 'from-yellow-500 to-orange-600', bgColor: 'from-yellow-50 to-orange-50' }
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl shadow-xl p-1 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden cursor-pointer"
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Inner Card */}
                <div className="relative bg-white rounded-3xl p-8 text-center h-full">
                  {/* Decorative Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full -mr-12 -mt-12 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${stat.color} rounded-2xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl`}>
                      <stat.icon className="text-4xl text-white" />
                    </div>
                    <div className={`text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-700 font-bold text-lg">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white observe-animation opacity-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Dream Motorcycle?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join thousands of satisfied customers who found their perfect ride with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/search"
              className="px-10 py-5 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FaMotorcycle />
              <span>Browse Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slow-zoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default Home;
