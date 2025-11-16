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
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

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
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 md:p-2 rounded-lg md:rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaMotorcycle className="text-xl md:text-3xl text-white" />
              </div>
              <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MotoMINDORO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Location Status */}
            {locationActive && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="relative">
                  <FaMapMarkerAlt className="text-green-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                </div>
                <span className="text-xs font-semibold text-green-700">Location Active</span>
              </div>
            )}

            <Link 
              to="/search" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
            >
              <FaSearch className="text-lg" />
              <span>Search</span>
            </Link>
            <Link 
              to="/map" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
            >
              <FaMapMarkedAlt className="text-lg" />
              <span>Map</span>
            </Link>

            {user ? (
              <>
                {user.role === 'seller' && (
                  <Link 
                    to="/listings/create" 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg"
                  >
                    <FaMotorcycle className="text-lg" />
                    <span>Add Listing</span>
                  </Link>
                )}
                {user.role !== 'admin' && (
                  <Link 
                    to="/favorites" 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-200 font-medium"
                  >
                    <FaHeart className="text-lg" />
                    <span>Favorites</span>
                  </Link>
                )}
                {user.role !== 'admin' && (
                  <Link 
                    to="/messages" 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium relative"
                  >
                    <div className="relative">
                      <FaComments className="text-lg" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <span>Messages</span>
                  </Link>
                )}
                <Link 
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="relative px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                  {user.role === 'admin' && pendingStoresCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {pendingStoresCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 hidden group-hover:block border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FaUser />
                      <span>Profile Settings</span>
                    </Link>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                        <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {/* Location Status Mobile */}
            {locationActive && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200 mb-2">
                <FaMapMarkerAlt className="text-green-600" />
                <span className="text-xs font-semibold text-green-700">Location Active</span>
              </div>
            )}

            <Link 
              to="/search" 
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              <FaSearch className="text-lg" />
              <span className="font-medium">Search</span>
            </Link>

            <Link 
              to="/map" 
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              <FaMapMarkedAlt className="text-lg" />
              <span className="font-medium">Map</span>
            </Link>

            {user ? (
              <>
                {user.role === 'seller' && (
                  <Link 
                    to="/listings/create" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-md mb-2"
                  >
                    <FaMotorcycle className="text-lg" />
                    <span>Add Listing</span>
                  </Link>
                )}
                {user.role !== 'admin' && (
                  <Link 
                    to="/favorites" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <FaHeart className="text-lg" />
                    <span className="font-medium">Favorites</span>
                  </Link>
                )}

                {user.role !== 'admin' && (
                  <Link 
                    to="/messages" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all relative"
                  >
                    <div className="relative">
                      <FaComments className="text-lg" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">Messages</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                <Link 
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <FaUser className="text-lg" />
                  <span className="font-medium">{user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</span>
                </Link>

                <Link 
                  to="/profile" 
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <FaCog className="text-lg" />
                  <span className="font-medium">Profile Settings</span>
                </Link>

                {user.role !== 'admin' && (
                  <>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                      {soundEnabled ? <FaVolumeUp className="text-lg" /> : <FaVolumeMute className="text-lg" />}
                      <span className="font-medium">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                    </button>
                    <button
                      onClick={() => {
                        playNotificationSound();
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all"
                    >
                      <FaVolumeUp className="text-lg text-green-600" />
                      <span className="font-medium">Test Sound</span>
                    </button>
                  </>
                )}

                <div className="border-t border-gray-200 my-2"></div>

                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-bold shadow-md"
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
