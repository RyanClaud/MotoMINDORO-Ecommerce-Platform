import { Link } from 'react-router-dom';
import { FaGavel, FaHandshake, FaExclamationTriangle } from 'react-icons/fa';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaGavel className="text-5xl mx-auto mb-4 opacity-80" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-lg text-blue-100">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaHandshake className="text-2xl text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Welcome to MotoMarket</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            By using MotoMarket, you agree to these Terms of Service. We're a motorcycle marketplace 
            connecting buyers and sellers in the Philippines. Please read carefully before using our platform.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-4">
          {/* What We Offer */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Offer</h2>
            <p className="text-gray-700 mb-3">
              MotoMarket connects motorcycle buyers and sellers in the Philippines. You can browse listings, 
              create stores, list motorcycles, and communicate with other users. We're just the platform - 
              all transactions happen directly between you and other users.
            </p>
          </section>

          {/* Your Account */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your Account</h2>
            <p className="text-gray-700 mb-2">
              Keep your account info accurate and your password secure. You're responsible for everything 
              that happens under your account.
            </p>
            <div className="mt-3 text-sm text-gray-600">
              <p><strong>Buyers:</strong> Browse, search, and contact sellers</p>
              <p><strong>Sellers:</strong> Create stores and list motorcycles</p>
            </div>
          </section>

          {/* Rules */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What's Not Allowed</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-3">
              <div className="flex items-center mb-2">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                <span className="font-semibold text-red-800">Prohibited Activities</span>
              </div>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              <li>Posting fake or misleading listings</li>
              <li>Harassing or threatening other users</li>
              <li>Listing stolen motorcycles or items without proper documentation</li>
              <li>Creating multiple accounts to manipulate the system</li>
              <li>Violating Philippine laws</li>
            </ul>
          </section>

          {/* Listings */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Listing Guidelines</h2>
            <p className="text-gray-700 mb-2">
              Be honest and accurate in your listings. Use clear photos, correct prices, and valid contact info. 
              Only list motorcycles you legally own with proper documentation.
            </p>
          </section>

          {/* Fees */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Fees & Payments</h2>
            <p className="text-gray-700">
              MotoMarket is currently free to use. All transactions happen directly between buyers and sellers - 
              we don't process payments. We may introduce fees in the future with advance notice.
            </p>
          </section>

          {/* Privacy */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Privacy</h2>
            <p className="text-gray-700 mb-3">
              We take your privacy seriously. Check out our Privacy Policy to learn how we handle your data.
            </p>
            <Link 
              to="/privacy-policy" 
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Read Privacy Policy →
            </Link>
          </section>

          {/* Disclaimers */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Important Disclaimers</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-3">
              <p className="text-yellow-800 font-semibold text-sm">
                MotoMarket is provided "as is" - we don't guarantee accuracy of listings or verify users.
              </p>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              <li>We're not responsible for motorcycle quality or condition</li>
              <li>We don't verify user identities</li>
              <li>Platform may be down for maintenance</li>
              <li>Use at your own risk</li>
            </ul>
          </section>

          {/* Termination */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Account Termination</h2>
            <p className="text-gray-700">
              We can suspend or terminate accounts that violate these terms. You can also delete your 
              account anytime by contacting us.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="text-gray-700"><strong>Email:</strong> legal@motomarket.ph</p>
              <p className="text-gray-700"><strong>Phone:</strong> +63 2 8123 4567</p>
              <p className="text-gray-700"><strong>Address:</strong> Makati City, Metro Manila</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Questions?</h3>
            <p className="mb-4 text-sm">We're here to help clarify any concerns.</p>
            <Link 
              to="/contact" 
              className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
