import { FaWifi } from 'react-icons/fa';

const Offline = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse">
            <FaWifi className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">You're Offline</h1>
          <p className="text-lg text-gray-600 mb-8">
            It looks like you've lost your internet connection. Don't worry, you can still browse cached content!
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-3">While you're offline:</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Browse previously viewed listings</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>View cached store information</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Access your favorites</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Your connection will be restored automatically when you're back online.
        </p>
      </div>
    </div>
  );
};

export default Offline;
