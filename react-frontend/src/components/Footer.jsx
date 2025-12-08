import { Link } from 'react-router-dom';
import { FaMotorcycle, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-4">
        {/* Mobile: Single column compact view */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <img 
                src="/motomindoro_logo.png" 
                alt="MotoMindoro Logo" 
                className="w-6 h-6 object-contain"
              />
              <span className="text-sm font-bold">MotoMindoro</span>
            </div>
            <div className="flex space-x-2">
              <a href="#" className="w-6 h-6 bg-gray-700 hover:bg-blue-600 rounded flex items-center justify-center transition-colors">
                <FaFacebook className="text-xs" />
              </a>
              <a href="#" className="w-6 h-6 bg-gray-700 hover:bg-blue-400 rounded flex items-center justify-center transition-colors">
                <FaTwitter className="text-xs" />
              </a>
              <a href="#" className="w-6 h-6 bg-gray-700 hover:bg-pink-600 rounded flex items-center justify-center transition-colors">
                <FaInstagram className="text-xs" />
              </a>
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <p>&copy; 2024 MotoMindoro</p>
            <div className="flex space-x-2">
              <Link to="/privacy-policy" className="hover:text-blue-400">Privacy</Link>
              <Link to="/terms-of-service" className="hover:text-blue-400">Terms</Link>
            </div>
          </div>
        </div>

        {/* Desktop: Full grid view */}
        <div className="hidden md:grid grid-cols-4 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <img 
                src="/motomindoro_logo.png" 
                alt="MotoMindoro Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-bold">MotoMindoro</span>
            </div>
            <p className="text-gray-400 text-xs mb-2">
              Your trusted motorcycle marketplace
            </p>
            <div className="flex space-x-2">
              <a href="#" className="w-7 h-7 bg-gray-700 hover:bg-blue-600 rounded flex items-center justify-center transition-colors">
                <FaFacebook className="text-sm" />
              </a>
              <a href="#" className="w-7 h-7 bg-gray-700 hover:bg-blue-400 rounded flex items-center justify-center transition-colors">
                <FaTwitter className="text-sm" />
              </a>
              <a href="#" className="w-7 h-7 bg-gray-700 hover:bg-pink-600 rounded flex items-center justify-center transition-colors">
                <FaInstagram className="text-sm" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2 text-white">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <a href="/search" className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                  Browse Motorcycles
                </a>
              </li>
              <li>
                <a href="/map" className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                  Find Stores
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                  Sell Your Bike
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2 text-white">Support</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2 text-white">Stay Updated</h3>
            <p className="text-gray-400 mb-2 text-xs">
              Get updates on new listings
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-2 py-1 text-xs bg-gray-700 text-white rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-2 py-1 rounded-r hover:from-blue-700 hover:to-indigo-700 transition-all">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: Bottom bar */}
        <div className="hidden md:block border-t border-gray-700 mt-3 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs">
              &copy; 2024 MotoMindoro. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 text-xs transition-colors">Privacy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400 text-xs transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
