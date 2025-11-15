import { Link } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaCookie, FaUserShield } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaShieldAlt className="text-5xl mx-auto mb-4 opacity-80" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-lg text-green-100">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaUserShield className="text-2xl text-green-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Your Privacy Matters</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            We're committed to protecting your privacy. This policy explains how we collect, use, and 
            safeguard your information when you use MotoMarket. By using our platform, you agree to 
            these practices.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-green-50 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Quick Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <FaLock className="text-green-600" />
              <span className="text-gray-700 text-sm font-medium">We protect your data</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaShieldAlt className="text-green-600" />
              <span className="text-gray-700 text-sm font-medium">We're transparent</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaUserShield className="text-green-600" />
              <span className="text-gray-700 text-sm font-medium">You have control</span>
            </div>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-4">
          {/* What We Collect */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Collect</h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Info You Provide</h3>
                <p className="text-gray-700 text-sm">
                  Name, email, phone, profile photo, store details, motorcycle listings, and messages 
                  between users.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Automatic Info</h3>
                <p className="text-gray-700 text-sm">
                  Device info, IP address, browser type, pages visited, location data (with permission), 
                  and cookies.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use It */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">How We Use Your Info</h2>
            
            <div className="space-y-2">
              <div className="bg-green-50 rounded-lg p-3">
                <h3 className="font-semibold text-green-800 mb-1 text-sm">Platform Operations</h3>
                <p className="text-green-700 text-sm">
                  Run the marketplace, display listings, enable communication, provide support
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <h3 className="font-semibold text-blue-800 mb-1 text-sm">Improvements</h3>
                <p className="text-blue-700 text-sm">
                  Analyze usage, develop features, personalize experience, prevent fraud
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3">
                <h3 className="font-semibold text-yellow-800 mb-1 text-sm">Legal & Safety</h3>
                <p className="text-yellow-700 text-sm">
                  Comply with laws, enforce terms, protect against fraud, resolve disputes
                </p>
              </div>
            </div>
          </section>

          {/* Sharing */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Who We Share With</h2>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-3">
              <p className="text-red-800 font-semibold text-sm mb-1">We don't sell your data.</p>
              <p className="text-red-700 text-sm">
                We only share in limited circumstances described below.
              </p>
            </div>

            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Other Users:</strong> Your public profile and listings are visible to others</li>
              <li><strong>Service Providers:</strong> Hosting, analytics, and support tools</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect safety</li>
            </ul>
          </section>

          {/* Security */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Data Security</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <FaLock className="text-2xl text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Technical</h3>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• SSL/TLS encryption</li>
                  <li>• Secure password hashing</li>
                  <li>• Regular security updates</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <FaShieldAlt className="text-2xl text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Operational</h3>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Limited employee access</li>
                  <li>• Security training</li>
                  <li>• Incident response</li>
                </ul>
              </div>
            </div>

            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-xs">
                <strong>Note:</strong> No system is 100% secure. Use strong passwords and keep your info confidential.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies & Tracking</h2>
            
            <div className="flex items-center mb-3">
              <FaCookie className="text-2xl text-orange-500 mr-2" />
              <span className="font-semibold text-gray-900">How We Use Cookies</span>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Essential:</strong> Required for login and basic functionality</p>
              <p><strong>Analytics:</strong> Help us understand usage (Google Analytics)</p>
              <p><strong>Control:</strong> Manage cookies through your browser settings</p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your Rights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <h3 className="font-semibold text-blue-800 mb-1 text-sm">Access & Update</h3>
                <p className="text-blue-700 text-xs">
                  View and update your info through account settings
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <h3 className="font-semibold text-green-800 mb-1 text-sm">Data Export</h3>
                <p className="text-green-700 text-xs">
                  Request a copy of your data
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3">
                <h3 className="font-semibold text-yellow-800 mb-1 text-sm">Delete Account</h3>
                <p className="text-yellow-700 text-xs">
                  Request deletion anytime
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <h3 className="font-semibold text-purple-800 mb-1 text-sm">Communications</h3>
                <p className="text-purple-700 text-xs">
                  Control what emails you receive
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">How Long We Keep Data</h2>
            <ul className="space-y-1 text-sm text-gray-700">
              <li><strong>Account Data:</strong> Until you delete your account</li>
              <li><strong>Listings:</strong> Until you remove them</li>
              <li><strong>Messages:</strong> 2 years for support</li>
              <li><strong>Analytics:</strong> 26 months (Google Analytics)</li>
            </ul>
          </section>

          {/* Children */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Age Restriction</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-800 font-semibold text-sm mb-1">18+ Only</p>
              <p className="text-red-700 text-sm">
                MotoMarket is not for users under 18. We don't knowingly collect data from minors.
              </p>
            </div>
          </section>

          {/* Changes */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Policy Updates</h2>
            <p className="text-gray-700 text-sm">
              We may update this policy. We'll notify you via email or platform notice. 
              Continued use means you accept the changes.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <FaShieldAlt className="text-green-600" />
                  <div>
                    <p className="font-semibold">Data Protection</p>
                    <p className="text-xs">privacy@motomarket.ph</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaLock className="text-blue-600" />
                  <div>
                    <p className="font-semibold">Security Team</p>
                    <p className="text-xs">security@motomarket.ph</p>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2 text-xs">
                  <p><strong>Address:</strong> Makati City, Metro Manila, Philippines</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Privacy Questions?</h3>
            <p className="mb-4 text-sm">We're committed to protecting your information.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/contact" 
                className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm"
              >
                Contact Privacy Team
              </Link>
              <Link 
                to="/terms-of-service" 
                className="inline-block bg-green-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-800 transition-colors text-sm"
              >
                View Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
