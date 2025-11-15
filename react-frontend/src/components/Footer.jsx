import { Link } from 'react-router-dom';
import { FaMotorcycle, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-xl">
                <FaMotorcycle className="text-2xl text-white" />
              </div>
              <span className="text-2xl font-bold">MotoMindoro</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Your trusted marketplace for buying and selling motorcycles nationwide.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-300">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                <FaInstagram className="text-lg" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/search" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Browse Motorcycles</span>
                </a>
              </li>
              <li>
                <a href="/map" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Find Stores</span>
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Sell Your Bike</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Help Center</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Newsletter</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to get updates on new listings and special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-r-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 MotoMindoro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Terms</Link>
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
