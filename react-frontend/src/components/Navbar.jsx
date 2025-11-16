import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  FaMotorcycle, FaUser, FaHeart, FaMapMarkedAlt, FaSearch, 
  FaMapMarkerAlt, FaBars, FaTimes, FaSignOutAlt, FaCog, FaComments,
  FaVolumeUp, FaVolumeMute
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [locationActive, setLocationActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);
  const [pendingStoresCount, setPendingStoresCount] = useState(0);
  const [pendingLocationSuggestionsCount, setPendingLocationSuggestionsCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    
    // Split name by spaces and get first letter of each word
    const words = name.trim().split(/\s+/);
    const initials = words
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    
    return initials;
  };

  // Handle dropdown with delay
  const handleMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowDropdown(false);
    }, 200); // 200ms delay before hiding
    setDropdownTimeout(timeout);
  };

  useEffect(() => {
    const checkLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => setLocationActive(true),
          () => setLocationActive(false)
        );
      }
    };

    checkLocation();
    const interval = setInterval(checkLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  // Save sound preference to localStorage
  useEffect(() => {
    localStorage.setItem('notificationSoundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Play notification sound
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    
    try {
      // Create audio context
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      
      // Create oscillator for a pleasant notification sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure sound (pleasant "ding" sound)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // First tone
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1); // Second tone (higher)
      
      // Fade in and out
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
      
      // Play sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user && user.role !== 'admin') {
        try {
          const response = await api.get('/messages/unread-count');
          const newCount = response.data.count || 0;
          
          // Play sound if count increased (new message received)
          if (newCount > previousCount && previousCount !== 0) {
            playNotificationSound();
          }
          
          setPreviousCount(newCount);
          setUnreadCount(newCount);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      }
    };

    fetchUnreadCount();
    
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user, previousCount, soundEnabled]);

  // Fetch pending stores count for admins
  useEffect(() => {
    const fetchPendingStores = async () => {
      if (user && user.role === 'admin') {
        try {
          const response = await api.get('/admin/analytics');
          if (response.data.success) {
            setPendingStoresCount(response.data.data.totals.pending_stores || 0);
            setPendingLocationSuggestionsCount(response.data.data.totals.pending_location_suggestions || 0);
          }
        } catch (error) {
          console.error('Error fetching pending stores:', error);
        }
      }
    };

    fetchPendingStores();
    
    // Poll every 60 seconds for admins
    const interval = setInterval(fetchPendingStores, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="relative bg-white/95 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b-2 border-gray-100">
      {/* Premium Gradient Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 md:h-24">
          {/* Logo - Enhanced */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
              <div className="relative">
                {/* Animated Ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"></div>
                
                {/* Logo Container */}
                <div className="relative group-hover:scale-110 transition-all duration-300">
                  <img 
                    src="/motomindoro_logo.png" 
                    alt="MotoMindoro Logo" 
                    className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              
              <div>
                <span className="text-lg md:text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block leading-tight">
                  MotoMINDORO
                </span>
                <span className="hidden md:block text-xs text-gray-500 font-semibold">Find Your Dream Ride</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Enhanced */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Location Status - Enhanced */}
            {locationActive && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                <div className="relative flex items-center space-x-2 px-3 py-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg">
                  <div className="relative">
                    <FaMapMarkerAlt className="text-green-600" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                  <span className="text-xs font-bold text-green-700">Location</span>
                </div>
              </div>
            )}

            <Link 
              to="/search" 
              className="group relative flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-gray-700 hover:text-blue-600 transition-all duration-300 font-bold overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <FaSearch className="relative group-hover:scale-110 transition-transform" />
              <span className="relative">Search</span>
            </Link>
            
            <Link 
              to="/map" 
              className="group relative flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-gray-700 hover:text-blue-600 transition-all duration-300 font-bold overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <FaMapMarkedAlt className="relative group-hover:scale-110 transition-transform" />
              <span className="relative">Map</span>
            </Link>

            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Link 
                    to="/favorites" 
                    className="group relative flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-gray-700 hover:text-red-500 transition-all duration-300 font-bold overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <FaHeart className="relative group-hover:scale-110 transition-transform" />
                    <span className="relative">Favorites</span>
                  </Link>
                )}
                
                {user.role !== 'admin' && (
                  <Link 
                    to="/messages" 
                    className="group relative flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-gray-700 hover:text-green-600 transition-all duration-300 font-bold overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <FaComments className="group-hover:scale-110 transition-transform" />
                      {unreadCount > 0 && (
                        <>
                          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg border-2 border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="relative">Messages</span>
                  </Link>
                )}
                
                <Link 
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="group relative px-3 py-2 rounded-2xl text-gray-700 hover:text-blue-600 transition-all duration-300 font-bold overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative">{user.role === 'admin' ? 'Admin' : 'Dashboard'}</span>
                  {user.role === 'admin' && (pendingStoresCount + pendingLocationSuggestionsCount) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg border-2 border-white">
                      {pendingStoresCount + pendingLocationSuggestionsCount}
                    </span>
                  )}
                </Link>
                
                <div 
                  className="relative group"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-2xl text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 font-bold">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur transition-opacity ${showDropdown ? 'opacity-100' : 'opacity-0'}`}></div>
                      <div className="relative w-9 h-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg border-2 border-white">
                        {getInitials(user.name)}
                      </div>
                    </div>
                    <span className="text-sm font-black">{getInitials(user.name)}</span>
                  </button>
                  
                  {/* Enhanced Dropdown */}
                  <div className={`absolute right-0 mt-1 w-64 bg-white rounded-3xl shadow-2xl py-3 border-2 border-gray-100 overflow-hidden transition-all duration-200 ${showDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    {/* Gradient Header */}
                    <div className="px-5 py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b-2 border-gray-100">
                      <p className="text-base font-black text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600 font-semibold truncate">{user.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all"
                      >
                        <FaUser className="text-lg" />
                        <span>Profile Settings</span>
                      </Link>
                      
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className="flex items-center space-x-3 w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all"
                        >
                          {soundEnabled ? <FaVolumeUp className="text-lg" /> : <FaVolumeMute className="text-lg" />}
                          <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                        </button>
                      )}
                      
                      <div className="my-2 mx-4 border-t-2 border-gray-100"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full text-left px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="group relative px-6 py-2.5 rounded-2xl text-gray-700 hover:text-blue-600 transition-all duration-300 font-bold overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 font-black shadow-xl hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative">Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all shadow-lg"
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Enhanced */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-white to-gray-50 border-t-2 border-gray-100 shadow-2xl">
          <div className="px-4 py-4 space-y-2">
            {/* Location Status Mobile - Enhanced */}
            {locationActive && (
              <div className="flex items-center space-x-3 px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 mb-3 shadow-lg">
                <div className="relative">
                  <FaMapMarkerAlt className="text-green-600 text-xl" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                </div>
                <span className="text-sm font-black text-green-700">Location Active</span>
              </div>
            )}

            <Link 
              to="/search" 
              onClick={closeMobileMenu}
              className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <div className="bg-blue-100 p-2 rounded-xl">
                <FaSearch className="text-xl text-blue-600" />
              </div>
              <span>Search</span>
            </Link>

            <Link 
              to="/map" 
              onClick={closeMobileMenu}
              className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <div className="bg-indigo-100 p-2 rounded-xl">
                <FaMapMarkedAlt className="text-xl text-indigo-600" />
              </div>
              <span>Map</span>
            </Link>

            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Link 
                    to="/favorites" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <div className="bg-red-100 p-2 rounded-xl">
                      <FaHeart className="text-xl text-red-600" />
                    </div>
                    <span>Favorites</span>
                  </Link>
                )}

                {user.role !== 'admin' && (
                  <Link 
                    to="/messages" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105 relative"
                  >
                    <div className="relative bg-green-100 p-2 rounded-xl">
                      <FaComments className="text-xl text-green-600" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                <Link 
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <div className="bg-blue-100 p-2 rounded-xl">
                    <FaUser className="text-xl text-blue-600" />
                  </div>
                  <span>{user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</span>
                </Link>

                <Link 
                  to="/profile" 
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-4 px-5 py-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <div className="bg-purple-100 p-2 rounded-xl">
                    <FaCog className="text-xl text-purple-600" />
                  </div>
                  <span>Profile Settings</span>
                </Link>

                {user.role !== 'admin' && (
                  <>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="flex items-center space-x-4 w-full px-5 py-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <div className="bg-blue-100 p-2 rounded-xl">
                        {soundEnabled ? <FaVolumeUp className="text-xl text-blue-600" /> : <FaVolumeMute className="text-xl text-blue-600" />}
                      </div>
                      <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                    </button>
                    <button
                      onClick={() => {
                        playNotificationSound();
                      }}
                      className="flex items-center space-x-4 w-full px-5 py-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <div className="bg-green-100 p-2 rounded-xl">
                        <FaVolumeUp className="text-xl text-green-600" />
                      </div>
                      <span>Test Sound</span>
                    </button>
                  </>
                )}

                <div className="border-t-2 border-gray-200 my-3"></div>

                <div className="px-5 py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-gray-100 shadow-md">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                  <p className="text-base font-black text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600 font-semibold truncate">{user.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-4 w-full px-5 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all font-black shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <div className="bg-red-100 p-2 rounded-xl">
                    <FaSignOutAlt className="text-xl" />
                  </div>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center px-6 py-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all font-black shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
